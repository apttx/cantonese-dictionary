import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { cwd } from 'node:process'

const types_directory = resolve(cwd(), './source/types/')

const file_names = ['Phrase.gql', 'Routable.gql', 'Video.gql', 'Rich_Text.gql', 'Language.gql']
// this has to always be at the end
file_names.push('Query.gql')
const file_paths = file_names.map((file_name) => {
  /** @type {string} */
  const file_path = resolve(types_directory, file_name)

  return file_path
})

const file_buffers = file_paths.map((file_path) => {
  const buffer = readFileSync(file_path)

  return buffer
})

export const type_definitions = file_buffers.map((buffer) => buffer.toString())
