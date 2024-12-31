import { error } from '@sveltejs/kit'
import { client, gql } from '$graphql'
import type { Phrase } from '$types/Phrase'

export const config = {
  // incremental static regeneration
  isr: {
    // never expire
    expiration: false,
  },
}

const phrase_query = gql<{ phrase: Phrase }, { id: string }>`
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
