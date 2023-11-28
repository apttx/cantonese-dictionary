import { createHash } from 'node:crypto'
import { resolve } from 'node:path'
import { cwd } from 'process'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { stringify } from 'devalue'

import lunr from 'lunr'

/** @typedef {`${string} ${string} [${string}] /${string}/`} Cedict_Line */
/** @typedef {`${string} ${string} [${string}] {${string}} /${string}/`} Canto_Line */

/**
 * @typedef {{
 *   traditional: string
 *   simplified: string
 *   pinyin: string
 *   jyutping: string
 *   english_senses: string[]
 * }} Parsed_Phrase
 */
/** @typedef {Omit<Parsed_Phrase, 'jyutping'>} Parsed_Cedict_Phrase */

/** @type {(line: Cedict_Line | Canto_Line) => line is Cedict_Line} */
const is_canto_line = (line) => {
  return !/{[^}]+}/.test(line)
}

/**
 * @type {(
 *   line: Canto_Line | Cedict_Line,
 * ) => typeof line extends Canto_Line ? Parsed_Phrase : Parsed_Cedict_Phrase}
 */
const get_phrase = (line) => {
  const matches = line.match(
    /^(?<traditional>[^\s]*) (?<simplified>[^\s]*) \[(?<pinyin>[^\]]*)\] (?:{(?<jyutping>[^}]*)} )?\/(?<english>.*)\/[^/]*$/i,
  )

  if (!matches) {
    throw `unable to parse ${JSON.stringify(line)} [@get_phrase]`
  }

  const { traditional, simplified, pinyin, english } =
    /** @type {{ traditional: string; simplified: string; pinyin: string; english: string }} */ (
      matches.groups
    )
  const english_senses = english
    .split(/;/)
    .map((sense) => sense.trim())
    .filter(Boolean)

  if (is_canto_line(line)) {
    /** @type {Parsed_Cedict_Phrase} */
    const cedict_phrase = {
      traditional,
      simplified,
      pinyin,
      english_senses,
    }

    return cedict_phrase
  }

  const { jyutping } = /** @type {{ jyutping: string }} */ (matches.groups)
  /** @type {Parsed_Phrase} */
  const canto_phrase = {
    traditional,
    simplified,
    pinyin,
    english_senses,
    jyutping,
  }

  return canto_phrase
}

// empty lines & commented lines aren't data
/** @type {(file_line: string) => boolean} */
const is_data_line = (file_line) => !!file_line && !file_line.startsWith('#')

/**
 * @type {(options: {
 *   traditional: string
 *   simplified: string
 *   pinyin: string
 *   jyutping: string
 *   english: string
 * }) => string}
 */
const get_id = (options) => {
  const hash = createHash('md5')
  hash.update(Object.values(options).join(' '))
  const id = hash.digest('hex')

  return id
}

/** @type {(parsed_phrase: Parsed_Phrase) => Phrase[]} */
const get_phrases_from_parsed = (parsed_phrase) => {
  const { jyutping, pinyin, simplified, traditional } = parsed_phrase

  const phrases = parsed_phrase.english_senses.map((english) => {
    const id = get_id({ jyutping, pinyin, simplified, traditional, english })
    /** @type {Phrase[]} */
    const senses = []

    /** @type {Phrase} */
    const phrase = {
      id,
      traditional,
      simplified,
      pinyin,
      jyutping,
      english,
      senses,
    }

    return phrase
  })

  for (const phrase of phrases) {
    // senses are all phrases with the other english senses, but not this phrase itself
    phrase.senses = phrases.filter((sense) => sense.id !== phrase.id)
  }

  return phrases
}

/**
 * @type {(options: {
 *   cc_canto_file: Buffer
 *   cc_cedict_file: Buffer
 *   cc_cedict_canto_readings_file: Buffer
 * }) => Promise<Phrase[]>}
 */
const get_phrases = async (options) => {
  /** @type {Map<string, string>} */
  const cedict_canto_readings_map = new Map()
  for (const line of options.cc_cedict_canto_readings_file
    .toString()
    .split('\n')
    .filter((line) => !!line && !line.startsWith('#'))) {
    const matches = line.match(
      /^(?<traditional>[^\s]*) (?<simplified>[^\s]*) \[(?<pinyin>[^\]]*)\] {(?<jyutping>[^}]*)}.*$/i,
    )

    if (matches === null) {
      throw `unable to match syntax of canto reading ${JSON.stringify(line)} [@get_phrases]`
    }

    const { traditional, simplified, pinyin, jyutping } =
      /** @type {{ traditional: string; simplified: string; pinyin: string; jyutping: string }} */ (
        matches.groups
      )

    const reading_key = `${traditional} ${simplified} ${pinyin}`
    cedict_canto_readings_map.set(reading_key, jyutping)
  }

  const canto_file_string = options.cc_canto_file.toString()
  const canto_lines = /** @type {Cedict_Line[]} */ (
    canto_file_string.split(/[\n\r]+/).filter(is_data_line)
  )
  const parsed_canto_phrases = canto_lines.map((line) => get_phrase(line))

  const cedict_file_string = options.cc_cedict_file.toString()
  const cedict_lines = /** @type {Cedict_Line[]} */ (
    cedict_file_string.split(/[\n\r]+/).filter(is_data_line)
  )
  const parsed_cedict_phrases = cedict_lines.map((line) => get_phrase(line))

  const no_canto_readings = []

  /** @type {Parsed_Phrase[]} */
  const parsed_cedict_phrases_with_readings = []
  for (const parsed_cedict_phrase of parsed_cedict_phrases) {
    const reading_key = `${parsed_cedict_phrase.traditional} ${parsed_cedict_phrase.simplified} ${parsed_cedict_phrase.pinyin}`
    const jyutping = cedict_canto_readings_map.get(reading_key)

    if (!jyutping) {
      no_canto_readings.push(parsed_cedict_phrase)
      continue
    }

    const parsed_cedict_phrase_with_reading = {
      ...parsed_cedict_phrase,
      jyutping,
    }
    parsed_cedict_phrases_with_readings.push(parsed_cedict_phrase_with_reading)
  }

  if (no_canto_readings.length) {
    console.warn(
      `[warn] ignoring ${no_canto_readings.length.toLocaleString(
        'en-US',
      )} CC-CEDICT entries that do not have a cantonese reading [@get_phrases]`,
    )
  }

  const cedict_phrases = parsed_cedict_phrases_with_readings
    .map((parsed_phrase) => get_phrases_from_parsed(parsed_phrase))
    .flat()
  const canto_phrases = parsed_canto_phrases
    .map((parsed_phrase) => get_phrases_from_parsed(parsed_phrase))
    .flat()
  const phrases = [...cedict_phrases, ...canto_phrases]

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
  try {
    const data_source_files_directory = resolve(cwd(), './data_source_files')
    const cc_cedict_file_path = resolve(data_source_files_directory, './cedict.txt')
    const cc_canto_file_path = resolve(data_source_files_directory, './canto.txt')
    const cc_cedict_canto_readings_file_path = resolve(
      data_source_files_directory,
      './cedict_canto_readings.txt',
    )
    const [cc_cedict_file, cc_canto_file, cc_cedict_canto_readings_file] = await Promise.all([
      readFile(cc_cedict_file_path),
      readFile(cc_canto_file_path),
      readFile(cc_cedict_canto_readings_file_path),
    ])
    const phrases = await get_phrases({
      cc_cedict_file,
      cc_canto_file,
      cc_cedict_canto_readings_file,
    })
    const index = phrase_index(phrases)

    const build_directory = resolve(cwd(), './build')
    await mkdir(build_directory, { recursive: true })

    const index_file_path = resolve(cwd(), './build/index.json')
    await writeFile(index_file_path, JSON.stringify(index))

    const phrases_file_path = resolve(cwd(), './build/phrases.json')
    await writeFile(phrases_file_path, stringify(phrases))
  } catch (error) {
    console.error('build failed:', error)
  }
}

run()
