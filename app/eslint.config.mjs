import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import svelteParser from 'svelte-eslint-parser'
import js from '@eslint/js'
import eslintPluginSvelte from 'eslint-plugin-svelte'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: [
      '**/.DS_Store',
      '**/node_modules',
      'build',
      '.svelte-kit',
      'package',
      '**/.env',
      '**/.env.*',
      '!**/.env.example',
      '**/pnpm-lock.yaml',
      '**/package-lock.json',
      '**/yarn.lock',
    ],
  },
  js.configs.recommended,
  ...eslintPluginSvelte.configs['flat/recommended'],
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        extraFileExtensions: ['.svelte'],
      },
    },
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      ecmaVersion: 5,
      sourceType: 'script',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  },
]
