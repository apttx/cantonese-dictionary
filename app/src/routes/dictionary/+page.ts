import type { Search_Query } from '$api/source/resolvers/search.js'
import { client, gql } from '$graphql'
import { show_jyutping } from '$stores/show_jyutping.js'
import { show_pinyin } from '$stores/show_pinyin.js'
import type { Phrase } from '$types/Phrase'
import { error } from '@sveltejs/kit'
import { get } from 'svelte/store'

const search_query = gql<{ search: Phrase[] }, { query: Search_Query }>`
  query search($query: Search_Query!) {
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
  const query_string = url.searchParams.get('query')

  if (!query_string) {
    return {
      query: query_string,
      results: null,
    }
  }

  const query: Search_Query = {
    english: query_string,
    simplified: query_string,
    traditional: query_string,
  }
  if (get(show_jyutping)) {
    query.jyutping = query_string
  }
  if (get(show_pinyin)) {
    query.pinyin = query_string
  }

  const result = await client.query(search_query, { query }, { fetch })

  if (!result.data?.search) {
    error(500, result.error?.message)
  }

  const results = result.data.search

  return {
    query: query_string,
    results,
  }
}
