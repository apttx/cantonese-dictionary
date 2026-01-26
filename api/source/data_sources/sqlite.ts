import type { Phrase } from '../../../types/Phrase'
import type { Search_Query } from '../resolvers/search'

export interface Phrases_Row {
  id: string
  traditional: string
  simplified: string
  pinyin: string
  jyutping: string
  english: string
}

export type Phrases_Join_Phrases_Row = {
  [key in keyof Phrases_Row as `phrase_${key}`]: Phrases_Row[key]
} & {
  [key in keyof Phrases_Row as `sense_${key}`]: Phrases_Row[key]
}

export const get_phrase_with_senses = (senses_rows: Phrases_Join_Phrases_Row[]): Phrase => {
  // includes the phrase itself
  const all_senses = senses_rows.map((senses_row) => {
    const id = senses_row.sense_id
    const traditional = senses_row.sense_traditional
    const simplified = senses_row.sense_simplified
    const pinyin = senses_row.sense_pinyin
    const jyutping = senses_row.sense_jyutping
    const english = senses_row.sense_english

    const sense: Phrase = {
      id,
      traditional,
      simplified,
      pinyin,
      jyutping,
      english,
      senses: [],
    }

    return sense
  })

  for (const sense of all_senses) {
    sense.senses = all_senses.filter((available_sense) => available_sense.id !== sense.id)
  }

  // get the primary phrase. it is guaranteed to exist due to the join with the same table.
  const phrase_id = senses_rows[0].phrase_id
  const phrase = all_senses.find((sense) => sense.id === phrase_id) ?? all_senses[0]

  return phrase
}

export const get_phrases_with_senses = (
  phrases_join_phrases_rows: Phrases_Join_Phrases_Row[],
): Phrase[] => {
  const phrase_senses_map = new Map<string, Phrases_Join_Phrases_Row[]>()
  for (const phrases_join_phrases_row of phrases_join_phrases_rows) {
    if (!phrase_senses_map.has(phrases_join_phrases_row.phrase_id)) {
      phrase_senses_map.set(phrases_join_phrases_row.phrase_id, [])
    }

    phrase_senses_map.get(phrases_join_phrases_row.phrase_id)?.push(phrases_join_phrases_row)
  }

  const phrases = Array.from(phrase_senses_map.values()).map((phrases_join_phrases_rows) =>
    get_phrase_with_senses(phrases_join_phrases_rows),
  )

  return phrases
}
