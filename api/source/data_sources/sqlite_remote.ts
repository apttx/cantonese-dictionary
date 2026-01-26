import { createClient, type Row } from '@libsql/client'

interface Phrases_Row {
  id: string
  traditional: string
  simplified: string
  pinyin: string
  jyutping: string
  english: string
}

type Phrases_Join_Phrases_Row = {
  [key in keyof Phrases_Row as `phrase_${key}`]: Phrases_Row[key]
} & {
  [key in keyof Phrases_Row as `sense_${key}`]: Phrases_Row[key]
}

const isPhrasesJoinPhrasesRow = (row: Partial<Row>): row is Phrases_Join_Phrases_Row => {
  return (
    'phrase_id' in row &&
    'phrase_traditional' in row &&
    'phrase_simplified' in row &&
    'phrase_pinyin' in row &&
    'phrase_jyutping' in row &&
    'phrase_english' in row &&
    'sense_id' in row &&
    'sense_traditional' in row &&
    'sense_simplified' in row &&
    'sense_pinyin' in row &&
    'sense_jyutping' in row &&
    'sense_english' in row
  )
}

const get_phrase_with_senses = (senses_rows: Phrases_Join_Phrases_Row[]): Phrase => {
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

const get_phrases_with_senses = (
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

export const get_datasource = (options: { url: string; authToken: string }) => {
  const client = createClient(options)

  const search: Phrases_Datasource['search'] = async (options) => {
    const escaped_term = `"${options.term.replace(/"/g, '""')}"`

    const result_set = await client.execute(
      `SELECT
          phrases.id AS phrase_id,
          phrases.traditional AS phrase_traditional,
          phrases.simplified AS phrase_simplified,
          phrases.pinyin AS phrase_pinyin,
          phrases.jyutping AS phrase_jyutping,
          phrases.english AS phrase_english,

          senses.id AS sense_id,
          senses.traditional AS sense_traditional,
          senses.simplified AS sense_simplified,
          senses.pinyin AS sense_pinyin,
          senses.jyutping AS sense_jyutping,
          senses.english AS sense_english
        FROM
          (
            SELECT DISTINCT * FROM (
              SELECT * FROM phrases
                WHERE traditional=$term
                  OR simplified=$term
                  OR pinyin=$term
                  OR jyutping=$term
                  OR english=$term
              UNION ALL
              SELECT * FROM (
                SELECT * FROM search($term) ORDER BY rank
              )
            ) LIMIT $limit
          ) AS phrases
        LEFT JOIN
          phrases AS senses
            ON phrases.sense_group_id=senses.sense_group_id
        ;`,

      {
        $limit: options.limit,
        $term: escaped_term,
      },
    )
    const phrases_join_phrases = result_set.rows.filter((row) => isPhrasesJoinPhrasesRow(row))

    const phrases = get_phrases_with_senses(phrases_join_phrases)

    return phrases
  }

  const many: Phrases_Datasource['many'] = async (options) => {
    const result_set = await client.execute(
      `SELECT
          phrases.id AS phrase_id,
          phrases.traditional AS phrase_traditional,
          phrases.simplified AS phrase_simplified,
          phrases.pinyin AS phrase_pinyin,
          phrases.jyutping AS phrase_jyutping,
          phrases.english AS phrase_english,

          senses.id AS sense_id,
          senses.traditional AS sense_traditional,
          senses.simplified AS sense_simplified,
          senses.pinyin AS sense_pinyin,
          senses.jyutping AS sense_jyutping,
          senses.english AS sense_english
        FROM
          (SELECT * FROM phrases LIMIT $limit) AS phrases
        LEFT JOIN
          phrases AS senses
            ON phrases.sense_group_id=senses.sense_group_id
        ;`,
      {
        $limit: options.limit,
      },
    )
    const phrases_join_phrases = result_set.rows.filter((row) => isPhrasesJoinPhrasesRow(row))

    const phrases = get_phrases_with_senses(phrases_join_phrases)

    return phrases
  }

  const one: Phrases_Datasource['one'] = async (options) => {
    const result_set = await client.execute(
      `SELECT
          phrases.id AS phrase_id,
          phrases.traditional AS phrase_traditional,
          phrases.simplified AS phrase_simplified,
          phrases.pinyin AS phrase_pinyin,
          phrases.jyutping AS phrase_jyutping,
          phrases.english AS phrase_english,

          senses.id AS sense_id,
          senses.traditional AS sense_traditional,
          senses.simplified AS sense_simplified,
          senses.pinyin AS sense_pinyin,
          senses.jyutping AS sense_jyutping,
          senses.english AS sense_english
        FROM
          (SELECT * FROM phrases WHERE id=$id LIMIT 1) AS phrases
        LEFT JOIN
          phrases AS senses
            ON phrases.sense_group_id=senses.sense_group_id
        ;`,
      {
        $id: options.id,
      },
    )
    const phrases_join_phrases = result_set.rows.filter((row) => isPhrasesJoinPhrasesRow(row))

    const phrase = get_phrase_with_senses(phrases_join_phrases)

    return phrase
  }

  const datasource: Phrases_Datasource = {
    search,
    many,
    one,
  }

  return datasource
}
