import { resolve } from 'node:path'
import { cwd } from 'node:process'

import { handler } from './handler.mjs'
import {
  get_dictionary_datasource,
  get_phrases_datasource,
  get_promisified_database,
} from './data_sources/sqlite.mjs'

const sqlite_database_file_path = resolve(
  cwd(),
  process.env.SQLITE_DATABASE_FILE_PATH || './_sqlite.db',
)
// @ts-expect-error vercel supports top-level await
const promisified_database = await get_promisified_database(sqlite_database_file_path)
// @ts-expect-error vercel supports top-level await
const phrases_datasource = await get_phrases_datasource(promisified_database)
// @ts-expect-error vercel supports top-level await
const dictionary_datasource = await get_dictionary_datasource(promisified_database)

const request_listener = handler({
  phrases: phrases_datasource,
  dictionary: dictionary_datasource,
})

export default request_listener
