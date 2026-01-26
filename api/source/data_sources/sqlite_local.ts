import sqlite3, { type Database } from 'sqlite3'
import type { Phrases_Datasource } from '../../types/Resolver_Context'
import {
  get_phrase_with_senses,
  get_phrases_with_senses,
  get_search_query_sql,
  type Phrases_Join_Phrases_Row,
} from './sqlite'

export const get_promisified_database = async (database_file_path: string) => {
  const database = await new Promise<Database>((resolve, reject) => {
    const database = new sqlite3.Database(database_file_path, (error) => {
      if (error) {
        return reject(error)
      }

      resolve(database)
    })
  })

  const all = (sql: string, params?: unknown): Promise<unknown[]> => {
    const promise = new Promise<unknown[]>((resolve, reject) => {
      const callback = (error: Error | null, result: unknown[]) => {
        if (error) {
          return reject(error)
        }

        resolve(result)
      }

      if (params) {
        database.all(sql, params, callback)
        return
      }

      database.all(sql, callback)
    })

    return promise
  }

  return {
    all,
  }
}

export const get_datasource = async (
  promisified_database: Awaited<ReturnType<typeof get_promisified_database>>,
) => {
  const search: Phrases_Datasource['search'] = async (options) => {
    const escaped_term = `"${options.term.replace(/"/g, '""')}"`

    const phrases_join_phrases =
      /** @type {Phrases_Join_Phrases_Row[]} */ await promisified_database.all(
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

    const phrases = get_phrases_with_senses(phrases_join_phrases as Phrases_Join_Phrases_Row[])

    return phrases
  }

  const many: Phrases_Datasource['many'] = async (options) => {
    const phrases_join_phrases = await promisified_database.all(
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

    const phrases = get_phrases_with_senses(phrases_join_phrases as Phrases_Join_Phrases_Row[])

    return phrases
  }

  const one: Phrases_Datasource['one'] = async (options) => {
    const phrases_join_phrases = await promisified_database.all(
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

    const phrase = get_phrase_with_senses(phrases_join_phrases as Phrases_Join_Phrases_Row[])

    return phrase
  }

  /** @type {Phrases_Datasource} */
  const datasource = {
    search,
    many,
    one,
  }

  return datasource
}
