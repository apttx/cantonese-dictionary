import sqlite3 from 'sqlite3'

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

/** @param {Awaited<ReturnType<typeof get_promisified_database>>} promisified_database */
export const get_datasource = async (promisified_database) => {
  /** @type {Phrases_Datasource['search']} */
  const search = async (options) => {
    const phrases =
      /** @type {Phrase[]} */
      (
        await promisified_database.all('SELECT * FROM search($term) ORDER BY rank LIMIT $limit;', {
          $term: options.term,
          $limit: options.limit,
        })
      )

    return phrases
  }

  /** @type {Phrases_Datasource['many']} */
  const many = async (options) =>
    /** @type {Phrase[]} */ (
      await promisified_database.all(`SELECT * FROM phrases LIMIT $limit;`, {
        $limit: options.limit,
      })
    )

  /** @type {Phrases_Datasource} */
  const datasource = {
    search,
    many,
  }

  return datasource
}
