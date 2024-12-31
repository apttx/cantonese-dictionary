import { client, gql } from '$graphql'
import { error } from '@sveltejs/kit'
import type { Breadcrumb } from '../../Breadcrumb'

const search_query = gql<{ search: Phrase[] }, { query: string }>`
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
  const breadcrumbs: Breadcrumb[] = [{ route: url.pathname, text: 'Dictionary' }]
  const query = url.searchParams.get('query')

  if (!query) {
    return {
      breadcrumbs,
      query,
      results: null,
    }
  }

  const result = await client.query(search_query, { query }, { fetch })

  if (!result.data?.search) {
    error(500, result.error)
  }

  const results = result.data.search.map((phrase) => phrase)

  return {
    breadcrumbs,
    query,
    results,
  }
}
