export const Phrase_Where = /* GraphQL */ `
  input Phrase_Where {
    id: ID!
  }
`

export const Query = /* GraphQL */ `
  type Query {
    search(query: String!, limit: Int): [Phrase!]!
    phrases(after: ID, limit: Int): [Phrase!]!
    phrase(where: Phrase_Where): Phrase!
  }
`
