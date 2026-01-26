import { createYoga } from 'graphql-yoga'

import { schema } from './schema.ts'
import type { Phrases_Datasource, Resolver_Context } from '../types/Resolver_Context'

export const handler = (options: {
  phrases: Phrases_Datasource
  graphiql?: boolean
  landingPage?: boolean
}) => {
  const { phrases } = options
  const graphiql = options.graphiql ?? false
  const landingPage = options.landingPage ?? false
  const context = (): Resolver_Context => ({ phrases })

  const yoga = createYoga({
    schema,
    context,
    graphiql,
    landingPage,
  })

  return yoga
}
