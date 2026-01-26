import { createClient, type Row } from '@libsql/client'
import { type Phrases_Datasource } from '../../types/Resolver_Context'
import {
  get_phrase_with_senses,
  get_phrases_with_senses,
  get_search_query_sql,
  type Phrases_Join_Phrases_Row,
} from './sqlite'

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
