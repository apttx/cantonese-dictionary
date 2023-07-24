/** @type {import('prettier').Config} */
module.exports = {
  useTabs: false,
  tabWidth: 2,
  arrowParens: 'always',
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  semi: false,
  plugins: [
    require('prettier-plugin-svelte'),
    require('prettier-plugin-css-order'),
    require('prettier-plugin-jsdoc'),
  ],
  pluginSearchDirs: ['.'],
  overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }],
  singleAttributePerLine: true,
}
