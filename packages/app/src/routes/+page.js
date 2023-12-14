import { client, gql } from '$graphql'

/** @type {import('@urql/core').TypedDocumentNode<{ search: Phrase[] }, { query: string }>} */
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

export const load = async ({ url, fetch }) => {
  const query = url.searchParams.get('query')

  if (!query) {
    return {
      results: null,
    }
  }

  const result = await client.query(search_query, { query }, { fetch })

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
