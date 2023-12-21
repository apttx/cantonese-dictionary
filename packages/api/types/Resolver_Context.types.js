/**
 * @typedef {{
 *   search: (options: { term: string; limit: number }) => Promise<Phrase[]>
 *   many: (options: { limit: number }) => Promise<Phrase[]>
 *   one: (options: { id: string }) => Promise<Phrase>
 * }} Phrases_Datasource
 */

/**
 * @typedef {{
 *   from_text: (text: string) => Promise<Hanzi[]>
 * }} Hanzi_Datasource
 */

/**
 * @typedef {{
 *   phrases: Phrases_Datasource
 *   hanzi: Hanzi_Datasource
 * }} Resolver_Context
 */
