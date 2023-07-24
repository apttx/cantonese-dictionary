import { resolve } from 'node:path'
import { cwd } from 'node:process'

import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import copy from 'rollup-plugin-copy'

const build_directory_name = 'api'
const root_directory = resolve(cwd(), './vercel')
const build_directory = resolve(root_directory, `./${build_directory_name}`)
const index_file_name = '_index.json'
const phrases_file_name = '_phrases.json'

/** @type {import('rollup').RollupOptions} */
const configuration = {
  input: 'source/vercel.mjs',
  output: {
    file: resolve(build_directory, './handler.js'),
    format: 'esm',
  },
  external: ['node:fs', 'node:path', 'node:process', 'graphql-yoga', 'lunr'],
  plugins: [
    copy({
      targets: [
        { src: '../search/build/index.json', dest: build_directory, rename: index_file_name },
        { src: '../search/build/phrases.json', dest: build_directory, rename: phrases_file_name },
        { src: './package.json', dest: root_directory },
        { src: './pnpm-lock.yaml', dest: root_directory },
      ],
    }),
    replace({
      preventAssignment: true,
      values: {
        'process.env.INDEX_FILE_PATH': JSON.stringify(
          `./${build_directory_name}/${index_file_name}`,
        ),
        'process.env.PHRASES_FILE_PATH': JSON.stringify(
          `./${build_directory_name}/${phrases_file_name}`,
        ),
      },
    }),
    terser({ ecma: 2020 }),
  ],
}

export default configuration
