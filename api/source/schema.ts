import { createSchema } from 'graphql-yoga'

import { type_definitions } from './type_definitions.ts'
import { search } from './resolvers/search.ts'
import { phrases } from './resolvers/phrases.ts'
import { phrase } from './resolvers/phrase.ts'

export const schema = createSchema({
  typeDefs: type_definitions,
  resolvers: {
    Query: {
      search,
      phrases,
      phrase,
    },
  },
})
