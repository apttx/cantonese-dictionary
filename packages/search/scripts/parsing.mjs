import { createHash } from 'node:crypto'
import { get_english_senses } from './parsing/english'

/** @typedef {`${string} ${string} [${string}] /${string}/`} Cedict_Line */
/** @typedef {`${string} ${string} [${string}] {${string}} /${string}/`} Canto_Line */

/**
 * @typedef {{
 *   traditional: string
 *   simplified: string
 *   pinyin: string
 *   jyutping: string
 *   english_senses: string[]
 * }} Parsed_Canto_Phrase
 */
/** @typedef {Omit<Parsed_Canto_Phrase, 'jyutping'>} Parsed_Cedict_Phrase */
/**
 * @typedef {{
 *   id: string
 *   sense_group_id: string
 *   traditional: string
 *   simplified: string
 *   pinyin: string
 *   jyutping: string
 *   english: string
 *   senses: Parsed_Phrase[]
 * }} Parsed_Phrase
 */

/** @type {(line: Canto_Line) => Parsed_Canto_Phrase} */
const get_phrase = (line) => {
  const matches = line.match(
    /^(?<traditional>[^\s]*) (?<simplified>[^\s]*) \[(?<pinyin>[^\]]*)\] {(?<jyutping>[^}]*)}.*$/i,
  )

  if (!matches) {
    throw `unable to parse ${JSON.stringify(line)} [@get_phrase]`
  }

  const { traditional, simplified, pinyin, jyutping } = /**
   * @type {{
   *   traditional: string
   *   simplified: string
   *   pinyin: string
   *   jyutping: string
   * }}
   */ (matches.groups)
  const english_senses = get_english_senses(line)

  /** @type {Parsed_Canto_Phrase} */
  const canto_phrase = {
    traditional,
    simplified,
    pinyin,
    english_senses,
    jyutping,
  }

  return canto_phrase
}
/** @type {(line: Cedict_Line) => Parsed_Cedict_Phrase} */
const get_cedict_phrase = (line) => {
  const matches = line.match(
    /^(?<traditional>[^\s]*) (?<simplified>[^\s]*) \[(?<pinyin>[^\]]*)\].*$/i,
  )

  if (!matches) {
    throw `unable to parse ${JSON.stringify(line)} [@get_phrase]`
  }

  const { traditional, simplified, pinyin, jyutping } = /**
   * @type {{
   *   traditional: string
   *   simplified: string
   *   pinyin: string
   *   jyutping: string
   * }}
   */ (matches.groups)
  const english_senses = get_english_senses(line)

  /** @type {Parsed_Canto_Phrase} */
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
 *   english?: string
 * }) => string}
 */
const get_id = (options) => {
  const hash = createHash('md5')
  hash.update(Object.values(options).join(' '))
  const id = hash.digest('hex')

  return id
}

/** @type {(parsed_phrase: Parsed_Canto_Phrase) => Parsed_Phrase[]} */
const get_phrases_from_parsed = (parsed_phrase) => {
  const { jyutping, pinyin, simplified, traditional } = parsed_phrase
  const sense_group_id = get_id({ jyutping, pinyin, simplified, traditional })

  const phrases = parsed_phrase.english_senses.map((english) => {
    const id = get_id({ jyutping, pinyin, simplified, traditional, english })
    /** @type {Parsed_Phrase[]} */
    const senses = []

    /** @type {Parsed_Phrase} */
    const phrase = {
      id,
      sense_group_id,
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
 * }) => Promise<Parsed_Phrase[]>}
 */
export const get_phrases = async (options) => {
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
  const parsed_cedict_phrases = cedict_lines.map((line) => get_cedict_phrase(line))

  const no_canto_readings = []

  /** @type {Parsed_Canto_Phrase[]} */
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

  /** @type {Parsed_Phrase[]} */
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
