import { createServer } from 'node:http'
import { resolve } from 'node:path'
import { cwd } from 'node:process'
import { handler } from '../source/handler'
import { get_datasource, get_promisified_database } from '../source/data_sources/sqlite'
import {
  get_language_aspects_datasource,
  get_languages_datasource,
  get_videos_datasource,
} from '../source/data_sources/json'

const develop = async () => {
  console.info('reading files')
  const sqlite_database_file_path = resolve(cwd(), '../search/build/sqlite.db')
  const promisified_database = await get_promisified_database(sqlite_database_file_path)
  const phrases = await get_datasource(promisified_database)
  const languages = get_languages_datasource()
  const language_aspects = get_language_aspects_datasource()
  const videos = get_videos_datasource()

  console.info('creating server instance')
  const request_handler = handler({
    phrases,
    languages,
    language_aspects,
    videos,
    graphiql: true,
    landingPage: true,
  })
  const server = createServer(request_handler)

  server.listen(4000, () => console.info('running.\n  ~~> http://localhost:4000/graphql'))
}

develop()
