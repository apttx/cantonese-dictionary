import { gql } from '@urql/core'
import { error } from '@sveltejs/kit'

import { client } from '$graphql'

/** @type {import('@urql/core').TypedDocumentNode<{ phrases: Phrase[] }, void>} */
const phrases_query = gql`
  {
    phrases {
      id
      traditional
      simplified
      pinyin
      jyutping
      english
    }
  }
`

export const load = async ({ fetch }) => {
  const query_result = await client.query(phrases_query, undefined, { fetch }).toPromise()

  if (!query_result.data?.phrases) {
    error(500, query_result.error)
  }

  const phrases = JSON.parse(JSON.stringify(query_result.data.phrases))

  return {
    phrases,
  }
}
