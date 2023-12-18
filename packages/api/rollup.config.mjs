import { resolve } from 'node:path'
import { cwd } from 'node:process'

import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import virtual from '@rollup/plugin-virtual'
import copy from 'rollup-plugin-copy'

import { type_definitions } from './source/type_definitions.mjs'

const build_directory_name = 'api'
const root_directory = resolve(cwd(), './vercel')
const build_directory = resolve(root_directory, `./${build_directory_name}`)
const sqlite_database_file_name = '_sqlite.db'

/** @type {import('rollup').RollupOptions} */
const configuration = {
  input: 'source/vercel.mjs',
  output: {
    file: resolve(build_directory, './handler.js'),
    format: 'esm',
  },
  external: ['node:fs', 'node:path', 'node:process', 'graphql-yoga', 'sqlite3'],
  plugins: [
    copy({
      targets: [
        {
          src: '../search/build/sqlite.db',
          dest: build_directory,
          rename: sqlite_database_file_name,
        },
        { src: './package.json', dest: root_directory },
        { src: './pnpm-lock.yaml', dest: root_directory },
      ],
    }),
    replace({
      preventAssignment: true,
      values: {
        'process.env.SQLITE_DATABASE_FILE_PATH': JSON.stringify(
          `./${build_directory_name}/${sqlite_database_file_name}`,
        ),
      },
    }),
    terser({ ecma: 2020 }),
    virtual({
      'source/type_definitions.mjs': `export const type_definitions = ${JSON.stringify(
        type_definitions,
      )}`,
    }),
  ],
}

export default configuration
