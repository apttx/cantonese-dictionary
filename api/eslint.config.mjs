import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {},
  },
  {
    ignores: ['vercel'],
  },
]
