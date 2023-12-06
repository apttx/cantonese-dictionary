import { createSchema } from 'graphql-yoga'

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Phrase {
      id: String!
      traditional: String!
      simplified: String!
      jyutping: String!
      pinyin: String!
      english: String!
      senses: [Phrase!]!
    }

    type Search_Result {
      ref: String!
      score: Float!
      phrase: Phrase!
    }

    type Query {
      search(query: String!, limit: Int): [Phrase!]!
      phrases(after: ID, limit: Int): [Phrase!]!
    }
  `,
  resolvers: {
    Query: {
      /**
       * @type {import('graphql').GraphQLFieldResolver<
       *   void,
       *   Resolver_Context,
       *   { query: string; limit?: number }
       * >}
       */
      search: async (_, args, context) => {
        const term = args.query
        const limit = args.limit ?? 20
        const phrases = await context.phrases.search({ term, limit })

        return phrases
      },
      /**
       * @type {import('graphql').GraphQLFieldResolver<
       *   void,
       *   Resolver_Context,
       *   { limit?: number }
       * >}
       */
      phrases: async (_, args, context) => {
        let limit = args.limit ?? 20
        const phrases = await context.phrases.many({ limit })

        return phrases
      },
    },
  },
})
