export const Phrase_Where = /* GraphQL */ `
  input Phrase_Where {
    id: ID!
  }
`

export const Search_Query = /* GraphQL */ `
  input Search_Query {
    traditional: String
    simplified: String
    jyutping: String
    pinyin: String
    english: String
  }
`

export const Query = /* GraphQL */ `
  type Query {
    search(query: Search_Query!, limit: Int): [Phrase!]!
    phrases(after: ID, limit: Int): [Phrase!]!
    phrase(where: Phrase_Where): Phrase!
  }
`
