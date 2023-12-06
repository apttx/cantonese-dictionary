import { createHash } from 'node:crypto'
import { resolve } from 'node:path'
import { cwd } from 'process'
import { readFile } from 'node:fs/promises'
import sqlite3 from 'sqlite3'

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
    .split(/\//g)
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
  const canto_lines = /** @type {Canto_Line[]} */ (
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

  /** @type {Phrase[]} */
  let phrases = []
  /** @type {Set<string>} */
  const id_set = new Set()
  for (const phrase of canto_phrases) {
    if (!id_set.has(phrase.id)) {
      phrases.push(phrase)
      id_set.add(phrase.id)
    }
  }
  for (const phrase of cedict_phrases) {
    if (!id_set.has(phrase.id)) {
      phrases.push(phrase)
      id_set.add(phrase.id)
    }
  }

  return phrases
}

/** @param {string} database_file_path */
const get_promisified_database = async (database_file_path) => {
  /** @type {import('sqlite3').Database} */
  const database = await new Promise((resolve, reject) => {
    const database = new sqlite3.Database(database_file_path, (error) => {
      if (error) {
        return reject(error)
      }

      resolve(database)
    })
  })

  /** @type {(sql: string) => Promise<import('sqlite3').RunResult>} */
  const run = (sql) => {
    const promise = new Promise(
      (/** @type {(value: import('sqlite3').RunResult) => void} */ resolve, reject) => {
        const callback =
          /** @type {(error: Error | null, result: import('sqlite3').RunResult) => void} */
          (error, result) => {
            if (error) {
              return reject(error)
            }

            resolve(result)
          }

        database.run(sql, callback)
      },
    )

    return promise
  }

  /** @type {(sql: string) => Promise<void>} */
  const exec = (sql) => {
    const promise = new Promise((/** @type {(value: void) => void} */ resolve, reject) => {
      const callback =
        /** @type {(error: Error | null) => void} */
        (error) => {
          if (error) {
            return reject(error)
          }

          resolve()
        }

      database.exec(sql, callback)
    })

    return promise
  }

  /** @type {() => Promise<void>} */
  const close = () => {
    const promise = new Promise((/** @type {(value: void) => void} */ resolve, reject) => {
      const callback =
        /** @type {(error: Error | null) => void} */
        (error) => {
          if (error) {
            return reject(error)
          }

          resolve()
        }

      database.close(callback)
    })

    return promise
  }

  return {
    run,
    exec,
    close,
  }
}

const run = async () => {
  try {
    // set up database
    const database_file_path = resolve(cwd(), './build/sqlite.db')
    const database = await get_promisified_database(database_file_path)
    await database.run('DROP TABLE IF EXISTS phrases;')
    await database.run(
      `CREATE TABLE phrases (
        'id' VARCHAR(32) PRIMARY KEY NOT NULL,
        'traditional' VARCHAR(32),
        'simplified' VARCHAR(32),
        'english' VARCHAR(128),
        'pinyin' VARCHAR(128),
        'jyutping' VARCHAR(128)
        );`,
    )
    await database.run('DROP TABLE IF EXISTS senses_relation;')
    await database.run(
      `CREATE TABLE senses_relation (
        'of_id' VARCHAR(32) NOT NULL,
        'sense_id' VARCHAR(32) NOT NULL,
        FOREIGN KEY(of_id) REFERENCES phrases(id),
        FOREIGN KEY(sense_id) REFERENCES phrases(id)
      );`,
    )
    await database.run('DROP TABLE IF EXISTS search;')
    await database.run(`CREATE VIRTUAL TABLE search USING fts5(
      id,
      traditional,
      simplified,
      english,
      pinyin,
      jyutping
    );`)

    // parse data
    console.info('[info] parsing phrases [@run]')
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

    // write data
    console.info('[info] writing to database [@run]')
    const inserts = phrases.map(
      (phrase) =>
        `INSERT INTO phrases VALUES (
          '${phrase.id}',
          '${phrase.traditional}',
          '${phrase.simplified}',
          '${phrase.english.replace(/'/gi, "''")}',
          '${phrase.pinyin}',
          '${phrase.jyutping}'
        );
        INSERT INTO search VALUES (
          '${phrase.id}',
          '${phrase.traditional}',
          '${phrase.simplified}',
          '${phrase.english.replace(/'/gi, "''")}',
          '${phrase.pinyin}',
          '${phrase.jyutping}'
        );
        `,
    )
    const sql = `
          BEGIN TRANSACTION;
          ${inserts.join('\n')};
          COMMIT;
      `
    await database.exec(sql)

    await database.close()
  } catch (error) {
    console.error('build failed:', error)
    throw error
  }
}

run()
