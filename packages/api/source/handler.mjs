import { createYoga } from 'graphql-yoga'

import { schema } from './schema.mjs'

/**
 * @type {(options: {
 *   phrases: Phrases_Datasource
 *   hanzi: Hanzi_Datasource
 *   graphiql?: boolean
 *   landingPage?: boolean
 * }) => import('node:http').RequestListener}
 */
export const handler = (options) => {
  const { phrases, hanzi } = options
  const graphiql = options.graphiql ?? false
  const landingPage = options.landingPage ?? false
  /** @type {(initial_context: import('graphql-yoga').YogaInitialContext) => Resolver_Context} */
  const context = () => ({ phrases, hanzi })

  const yoga = createYoga({
    schema,
    context,
    graphiql,
    landingPage,
  })

  return yoga
}
