import { createSchema } from 'graphql-yoga'

import { type_definitions } from './type_definitions.mjs'
import { search } from './resolvers/search.mjs'
import { phrases } from './resolvers/phrases.mjs'

export const schema = createSchema({
  typeDefs: type_definitions,
  resolvers: {
    Query: {
      search,
      phrases,
    },
  },
})
