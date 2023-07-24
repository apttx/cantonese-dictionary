import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { cwd } from 'node:process'

import { handler } from './handler.mjs'

const index_file_path = resolve(cwd(), process.env.INDEX_FILE_PATH || './_index.json')
const index_file_string = readFileSync(index_file_path).toString()
const index_definition = JSON.parse(index_file_string)
const phrases_file_path = resolve(cwd(), process.env.PHRASES_FILE_PATH || './_phrases.json')
const phrases_file_string = readFileSync(phrases_file_path).toString()
const phrases = JSON.parse(phrases_file_string)

const request_listener = handler({ index_definition, phrases })

export default request_listener
