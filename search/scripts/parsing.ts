import { createHash } from 'node:crypto'
import { get_english_senses } from './parsing/english'

interface Parsed_Canto_Phrase {
  traditional: string
  simplified: string
  pinyin: string
  jyutping: string
  english_senses: string[]
}

type Parsed_Cedict_Phrase = Omit<Parsed_Canto_Phrase, 'jyutping'>

interface Parsed_Phrase {
  id: string
  sense_group_id: string
  traditional: string
  simplified: string
  pinyin: string
  jyutping: string
  english: string
  senses: Parsed_Phrase[]
}

interface Ranked_Parsed_Phrase extends Parsed_Phrase {
  ranking: number
}

const get_phrase = (line: string): Parsed_Canto_Phrase => {
  const matches = line.match(
    /^(?<traditional>[^\s]*) (?<simplified>[^\s]*) \[(?<pinyin>[^\]]*)\] {(?<jyutping>[^}]*)}.*$/i,
  )

  if (!matches) {
    throw `unable to parse ${JSON.stringify(line)} [@get_phrase]`
  }

  const { traditional, simplified, pinyin, jyutping } = matches.groups as {
    traditional: string
    simplified: string
    pinyin: string
    jyutping: string
  }
  const english_senses = get_english_senses(line)

  const canto_phrase: Parsed_Canto_Phrase = {
    traditional,
    simplified,
    pinyin,
    english_senses,
    jyutping,
  }

  return canto_phrase
}
const get_cedict_phrase = (line: string): Parsed_Cedict_Phrase => {
  const matches = line.match(
    /^(?<traditional>[^\s]*) (?<simplified>[^\s]*) \[(?<pinyin>[^\]]*)\].*$/i,
  )

  if (!matches) {
    throw `unable to parse ${JSON.stringify(line)} [@get_phrase]`
  }

  const { traditional, simplified, pinyin, jyutping } = matches.groups as {
    traditional: string
    simplified: string
    pinyin: string
    jyutping: string
  }
  const english_senses = get_english_senses(line)

  const canto_phrase: Parsed_Canto_Phrase = {
    traditional,
    simplified,
    pinyin,
    english_senses,
    jyutping,
  }

  return canto_phrase
}

// empty lines & commented lines aren't data
const is_data_line = (file_line: string) => !!file_line && !file_line.startsWith('#')

const get_id = (options: {
  traditional: string
  simplified: string
  pinyin: string
  jyutping: string
  english?: string
}) => {
  const hash = createHash('md5')
  hash.update(Object.values(options).join(' '))
  const id = hash.digest('hex')

  return id
}

const get_phrases_from_parsed = (parsed_phrase: Parsed_Canto_Phrase): Parsed_Phrase[] => {
  const { jyutping, pinyin, simplified, traditional } = parsed_phrase
  const sense_group_id = get_id({ jyutping, pinyin, simplified, traditional })

  const phrases = parsed_phrase.english_senses.map((english) => {
    const id = get_id({ jyutping, pinyin, simplified, traditional, english })
    const senses: Parsed_Phrase[] = []

    const phrase: Parsed_Phrase = {
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

const get_ranking_map = (content: Buffer) => {
  const characters = content
    .toString()
    .split('\n')
    .filter(is_data_line)
    .flatMap((line) => {
      return Array.from(line)
    })
  const length = characters.length
  const ranking_map = new Map(
    characters.map((character, index) => {
      return [character, index / length] as const
    }),
  )

  return ranking_map
}

const get_known_phrases = (content: Buffer) => {
  const lines = content
    .toString()
    .split('\n')
    .filter(is_data_line)
    .map((line) => line.trim())

  return new Set(lines)
}

const get_ranking_factor = (text: string) => {
  switch (text.length) {
    case 0:
    case 1:
      return 1
    case 2:
      return 1.5
  }

  return 1 / text.length + 0.5
}

const get_text_ranking = (options: {
  text: string
  ranking_map: Map<string, number>
  known_phrases: Set<string>
}) => {
  const ranking_sum = Array.from(options.text).reduce((sum, character) => {
    const character_ranking = options.ranking_map.get(character) ?? 0.5

    return sum + character_ranking
  }, 0)
  const average_ranking = ranking_sum / options.text.length
  const ranking_factor = get_ranking_factor(options.text)
  const ranking = average_ranking * ranking_factor

  const is_known_phrase = options.known_phrases.has(options.text)
  if (is_known_phrase) {
    return ranking * 2
  }

  return ranking
}

const get_phrase_ranking = (options: {
  phrase: Parsed_Phrase
  ranking_map: Map<string, number>
  known_phrases: Set<string>
}) => {
  const simplified_ranking = get_text_ranking({
    ...options,
    text: options.phrase.simplified,
  })
  const traditional_ranking = get_text_ranking({
    ...options,
    text: options.phrase.traditional,
  })

  return (simplified_ranking + traditional_ranking) / 2
}

export const get_phrases = async (options: {
  cc_canto_file: Buffer
  cc_cedict_file: Buffer
  cc_cedict_canto_readings_file: Buffer
  phrases_simplified_file: Buffer
  ranking_simplified_file: Buffer
  ranking_traditional_file: Buffer
}): Promise<Ranked_Parsed_Phrase[]> => {
  const cedict_canto_readings_map = new Map<string, string>()
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

    const { traditional, simplified, pinyin, jyutping } = matches.groups as {
      traditional: string
      simplified: string
      pinyin: string
      jyutping: string
    }

    const reading_key = `${traditional} ${simplified} ${pinyin}`
    cedict_canto_readings_map.set(reading_key, jyutping)
  }

  const canto_file_string = options.cc_canto_file.toString()
  const canto_lines = canto_file_string.split(/[\n\r]+/).filter(is_data_line)
  const parsed_canto_phrases = canto_lines.map((line) => get_phrase(line))

  const cedict_file_string = options.cc_cedict_file.toString()
  const cedict_lines = cedict_file_string.split(/[\n\r]+/).filter(is_data_line)
  const parsed_cedict_phrases = cedict_lines.map((line) => get_cedict_phrase(line))

  const no_canto_readings = []

  const parsed_cedict_phrases_with_readings: Parsed_Canto_Phrase[] = []
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

  const known_phrases = get_known_phrases(options.phrases_simplified_file)
  const ranking_map = new Map([
    ...get_ranking_map(options.ranking_simplified_file).entries(),
    ...get_ranking_map(options.ranking_traditional_file),
  ])

  const cedict_phrases = parsed_cedict_phrases_with_readings
    .map((parsed_phrase) => get_phrases_from_parsed(parsed_phrase))
    .flat()
  const canto_phrases = parsed_canto_phrases
    .map((parsed_phrase) => get_phrases_from_parsed(parsed_phrase))
    .flat()

  const phrases: Ranked_Parsed_Phrase[] = []
  const id_set = new Set<string>()
  for (const phrase of canto_phrases) {
    if (!id_set.has(phrase.id)) {
      phrases.push({
        ...phrase,
        ranking: get_phrase_ranking({
          phrase,
          known_phrases,
          ranking_map,
        }),
      })
      id_set.add(phrase.id)
    }
  }
  for (const phrase of cedict_phrases) {
    if (!id_set.has(phrase.id)) {
      phrases.push({
        ...phrase,
        ranking: get_phrase_ranking({
          phrase,
          known_phrases,
          ranking_map,
        }),
      })
      id_set.add(phrase.id)
    }
  }

  return phrases
}
