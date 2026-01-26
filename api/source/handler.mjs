import { createYoga } from 'graphql-yoga'

import { schema } from './schema.mjs'

/**
 * @param {{
 *   phrases: Phrases_Datasource
 *   graphiql?: boolean
 *   landingPage?: boolean
 * }} options
 */
export const handler = (options) => {
  const { phrases } = options
  const graphiql = options.graphiql ?? false
  const landingPage = options.landingPage ?? false
  /** @type {(initial_context: import('graphql-yoga').YogaInitialContext) => Resolver_Context} */
  const context = () => ({ phrases })

  const yoga = createYoga({
    schema,
    context,
    graphiql,
    landingPage,
  })

  return yoga
}
