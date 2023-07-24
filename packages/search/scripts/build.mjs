import { createHash } from 'node:crypto'
import { resolve } from 'node:path'
import { cwd } from 'process'
import { mkdir, writeFile, readFile } from 'node:fs/promises'

import lunr from 'lunr'

/** @type {(filename: string) => Promise<Phrase[]>} */
const read_phrases = async (file_path) => {
  const file_buffer = await readFile(file_path)
  const file_string = file_buffer.toString()

  // data lines (remove the comments at the beginning of the file)
  const file_lines = file_string
    .split('\n')
    .filter((file_line) => !!file_line && !file_line.startsWith('#'))

  /** @type {Phrase[]} */
  const phrases = file_lines.map((file_line) => {
    const matches = file_line.match(
      /^(?<traditional>[^\s]*) (?<simplified>[^\s]*) \[(?<pinyin>[^\]]*)\] {(?<jyutping>[^}]*)} \/(?<english>.*)\/.*$/i,
    )

    if (!matches) {
      throw `couldn't parse ${JSON.stringify(file_line)}`
    }

    const { traditional, simplified, pinyin, jyutping, english } = /** @type {Phrase} */ (
      matches.groups
    )

    const hash = createHash('md5')
    hash.update(file_line)
    const id = hash.digest('hex')

    /** @type {Phrase} */
    const phrase = {
      id,
      traditional,
      simplified,
      pinyin,
      jyutping,
      english,
    }

    return phrase
  })

  return phrases
}

/** @param {Phrase[]} phrases */
const phrase_index = (phrases) => {
  const index = lunr(function () {
    this.field('english')
    this.field('jyutping')
    this.field('traditional')
    this.field('simplified')

    for (const phrase of phrases) {
      this.add(phrase)
    }
  })

  return index
}

const run = async () => {
  const file_path = resolve(cwd(), '../../cc-canto-data/cccanto-webdist.txt')
  const phrases = await read_phrases(file_path)
  const index = phrase_index(phrases)

  const build_directory = resolve(cwd(), './build')
  await mkdir(build_directory, { recursive: true })

  const index_file_path = resolve(cwd(), './build/index.json')
  await writeFile(index_file_path, JSON.stringify(index))

  const phrases_file_path = resolve(cwd(), './build/phrases.json')
  await writeFile(phrases_file_path, JSON.stringify(phrases))
}

run()
