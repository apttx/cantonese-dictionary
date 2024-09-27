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
    exec,
    close,
  }
}
