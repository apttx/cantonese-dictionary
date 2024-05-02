import { resolve } from 'node:path'
import { cwd } from 'node:process'

import { handler } from './handler'
import { get_datasource, get_promisified_database } from './data_sources/sqlite'
import {
  get_language_aspects_datasource,
  get_languages_datasource,
  get_videos_datasource,
} from './data_sources/json'

const sqlite_database_file_path = resolve(
  cwd(),
  process.env.SQLITE_DATABASE_FILE_PATH || './_sqlite.db',
)
// @ts-expect-error vercel supports top-level await
const promisified_database = await get_promisified_database(sqlite_database_file_path)
// @ts-expect-error vercel supports top-level await
const phrases = await get_datasource(promisified_database)
const languages = get_languages_datasource()
const language_aspects = get_language_aspects_datasource()
const videos = get_videos_datasource()

const request_listener = handler({ phrases, languages, language_aspects, videos })

export default request_listener
