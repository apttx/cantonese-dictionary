import { error } from '@sveltejs/kit'
import { client, gql } from '$graphql'

/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
  // incremental static regeneration
  isr: {
    // never expire
    expiration: false,
  },
}

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

  const result = await client.query(phrase_query, { id }, { fetch })

  if (!result.data?.phrase) {
    error(404, result.error)
  }

  const phrase = result.data.phrase

  return {
    phrase,
  }
}
