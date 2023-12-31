import { error } from '@sveltejs/kit'

import { client, gql } from '$graphql'

/** @type {import('@urql/core').TypedDocumentNode<{ phrase: Phrase }, { id: string }>} */
const phrase_query = gql`
  query phrase($id: ID!) {
    phrase(where: { id: $id }) {
      id
      english
      traditional
      simplified
      jyutping
      pinyin
      senses {
        id
        english
        traditional
        simplified
        jyutping
        pinyin
      }
    }
  }
`

export const load = async ({ params }) => {
  const id = params.id

  const query_result = await client.query(phrase_query, { id }).toPromise()

  if (!query_result.data?.phrase) {
    error(404, query_result.error)
  }

  const phrase = query_result.data.phrase

  return {
    phrase,
  }
}
