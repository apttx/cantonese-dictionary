import { createYoga } from 'graphql-yoga'

import lunr from 'lunr'

import { schema } from './schema.mjs'

/**
 * @type {(options: {
 *   phrases: Phrase[]
 *   index_definition: import('lunr').Index
 *   graphiql?: boolean
 *   landingPage?: boolean
 * }) => import('node:http').RequestListener}
 */
export const handler = (options) => {
  const { phrases } = options
  const index = lunr.Index.load(options.index_definition)
  const id_phrase_map = Object.fromEntries(phrases.map((phrase) => [phrase.id, phrase]))

  const yoga = createYoga({
    schema,
    context: () => ({ phrases, search: { index, id_phrase_map } }),
    graphiql: options.graphiql ?? false,
    landingPage: options.landingPage ?? false,
  })

  return yoga
}
