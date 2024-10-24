import sqlite3 from 'sqlite3'

/**
 * @typedef {{
 *   id: string
 *   traditional: string
 *   simplified: string
 *   pinyin: string
 *   jyutping: string
 *   english: string
 * }} Phrases_Row
 */

/**
 * @typedef {{
 *   [key in keyof Phrases_Row as `phrase_${key}`]: Phrases_Row[key]
 * } & {
 *   [key in keyof Phrases_Row as `sense_${key}`]: Phrases_Row[key]
 * }} Phrases_Join_Phrases_Row
 */

/** @param {string} database_file_path */
export const get_promisified_database = async (database_file_path) => {
  /** @type {import('sqlite3').Database} */
  const database = await new Promise((resolve, reject) => {
    const database = new sqlite3.Database(database_file_path, (error) => {
      if (error) {
        return reject(error)
      }

      resolve(database)
    })
  })

  /** @type {(sql: string, params?: any) => Promise<any[]>} */
  const all = (sql, params) => {
    const promise = new Promise((/** @type {(value: any[]) => void} */ resolve, reject) => {
      const callback =
        /** @type {(error: Error | null, result: any[]) => void} */
        (error, result) => {
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

/** @type {(phrases_join_phrases_rows: Phrases_Join_Phrases_Row[]) => Phrase} */
const get_phrase_with_senses = (senses_rows) => {
  // includes the phrase itself
  const all_senses = senses_rows.map((senses_row) => {
    const id = senses_row.sense_id
    const traditional = senses_row.sense_traditional
    const simplified = senses_row.sense_simplified
    const pinyin = senses_row.sense_pinyin
    const jyutping = senses_row.sense_jyutping
    const english = senses_row.sense_english

    /** @type {Phrase} */
    const sense = {
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
  const phrase = /** @type {Phrase} */ (all_senses.find((sense) => sense.id === phrase_id))

  return phrase
}

/** @type {(phrases_join_phrases_rows: Phrases_Join_Phrases_Row[]) => Phrase[]} */
const get_phrases_with_senses = (phrases_join_phrases_rows) => {
  /** @type {Map<string, Phrases_Join_Phrases_Row[]>} */
  const phrase_senses_map = new Map()
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

/** @param {Awaited<ReturnType<typeof get_promisified_database>>} promisified_database */
export const get_datasource = async (promisified_database) => {
  /** @type {Phrases_Datasource['search']} */
  const search = async (options) => {
    const escaped_term = `"${options.term.replace(/"/g, '""')}"`

    const phrases_join_phrases = /** @type {Phrases_Join_Phrases_Row[]} */ (
      await promisified_database.all(
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
    )

    const phrases = get_phrases_with_senses(phrases_join_phrases)

    return phrases
  }

  /** @type {Phrases_Datasource['many']} */
  const many = async (options) => {
    const phrases_join_phrases = /** @type {Phrases_Join_Phrases_Row[]} */ (
      await promisified_database.all(
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
    )

    const phrases = get_phrases_with_senses(phrases_join_phrases)

    return phrases
  }

  /** @type {Phrases_Datasource['one']} */
  const one = async (options) => {
    const phrases_join_phrases = /** @type {Phrases_Join_Phrases_Row[]} */ (
      await promisified_database.all(
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
    )

    const phrase = get_phrase_with_senses(phrases_join_phrases)

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
