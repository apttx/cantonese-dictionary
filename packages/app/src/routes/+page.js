import { client, gql } from '$graphql'

const search_query = gql`
  query search($query: String!) {
    search(query: $query, limit: 50) {
      id
      english
      traditional
      simplified
      jyutping
      pinyin
    }
  }
`

export const load = async ({ url }) => {
  const query = url.searchParams.get('query')

  if (!query) {
    return {
      results: null,
    }
  }

  /** @type {import('@urql/core').OperationResult<{ search: Phrase[] }>} */
  const result = await client.query(search_query, { query })

  if (!result.data?.search) {
    return {
      results: null,
    }
  }

  const results = result.data.search.map((phrase) => phrase)

  return {
    results,
  }
}
