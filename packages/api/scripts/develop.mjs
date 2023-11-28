import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { cwd } from 'node:process'
import { handler } from '../source/handler.mjs'
import { parse } from 'devalue'

/** @type {(file_path: string) => Promise<any>} */
const load_json_file = async (file_path) => {
  const file_buffer = await readFile(file_path)
  const file_string = file_buffer.toString()
  const definition = JSON.parse(file_string)

  return definition
}

/** @type {(file_path: string) => Promise<any>} */
const load_devalue_json_file = async (file_path) => {
  const file_buffer = await readFile(file_path)
  const file_string = file_buffer.toString()
  const definition = parse(file_string)

  return definition
}

const develop = async () => {
  console.info('reading files')
  const index_file_path = resolve(cwd(), '../search/build/index.json')
  const index_definition = await load_json_file(index_file_path)

  const phrases_file_path = resolve(cwd(), '../search/build/phrases.json')
  /** @type {Phrase[]} */
  const phrases = await load_devalue_json_file(phrases_file_path)
  const alphabetically_sorted_phrases = phrases.sort((phraseA, phraseB) =>
    phraseA.english.localeCompare(phraseB.english),
  )

  console.info('creating server instance')
  const request_handler = handler({
    index_definition,
    phrases: alphabetically_sorted_phrases,
    graphiql: true,
    landingPage: true,
  })
  const server = createServer(request_handler)

  server.listen(4000, () => console.info('running.\n  ~~> http://localhost:4000/graphql'))
}

develop()
