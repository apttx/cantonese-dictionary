import { error } from '@sveltejs/kit'

import { gql, query } from '$graphql'

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

export const load = async ({ params, fetch }) => {
  const id = params.id

  const query_result = await query(phrase_query, { id }, { fetch })

  if (!query_result.data?.phrase) {
    error(404, query_result.error?.message)
  }

  const phrase = JSON.parse(JSON.stringify(query_result.data.phrase))

  return {
    phrase,
  }
}
