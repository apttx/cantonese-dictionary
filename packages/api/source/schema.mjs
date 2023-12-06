import { createSchema } from 'graphql-yoga'

/**
 * @type {import('graphql-yoga').GraphQLSchemaWithContext<{
 *   phrases: Phrase[]
 *   search: {
 *     index: import('lunr').Index
 *     id_phrase_map: { [key in string]: Phrase }
 *   }
 * }>}
 */
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
      search: (_, args, context) => {
        const { id_phrase_map, index } = context.search

        const search_results = index.search(args.query)

        const result = search_results.map((search_result) => {
          const { ref } = search_result
          const phrase = id_phrase_map[ref]

          return phrase
        })

        if (args.limit) {
          const capped_limit = Math.min(args.limit, 200)
          const limited = result.slice(0, capped_limit)

          return limited
        }

        return result
      },
      },
      phrases: (_, args, context) => {
        const { phrases } = context

        let lower_bound = 0
        if (args.after) {
          const index = phrases.findIndex((phrase) => phrase.id === args.after)

          lower_bound = index + 1
        }

        let limit = args.limit ?? 20
        const upper_bound = lower_bound + limit

        const result = phrases.slice(lower_bound, upper_bound)

        return result
      },
    },
  },
})
