import { createServer } from 'node:http'
import { resolve } from 'node:path'
import { cwd } from 'node:process'
import { handler } from '../source/handler.mjs'
import { get_datasource, get_promisified_database } from '../source/data_sources/sqlite.mjs'

const develop = async () => {
  console.info('reading files')
  const sqlite_database_file_path = resolve(cwd(), '../search/build/sqlite.db')
  const promisified_database = await get_promisified_database(sqlite_database_file_path)
  const phrases_datasource = await get_datasource(promisified_database)

  console.info('creating server instance')
  const request_handler = handler({
    phrases: phrases_datasource,
    graphiql: true,
    landingPage: true,
  })
  const server = createServer(request_handler)

  server.listen(4000, () => console.info('running.\n  ~~> http://localhost:4000/graphql'))
}

develop()
