/**
 * @typedef {{
 *   search: (options: { term: string; limit: number }) => Promise<Phrase[]>
 *   many: (options: { limit: number }) => Promise<Phrase[]>
 *   one: (options: { id: string }) => Promise<Phrase>
 * }} Phrases_Datasource
 */

/**
 * @typedef {{
 *   english_chapters: () => Promise<{ label: string }[]>
 * }} Dictionary_Datasource
 */

/**
 * @typedef {{
 *   phrases: Phrases_Datasource
 *   dictionary: Dictionary_Datasource
 * }} Resolver_Context
 */
