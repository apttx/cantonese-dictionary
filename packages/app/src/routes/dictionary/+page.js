import { gql } from '@urql/core'
import { client } from '../../graphql.mjs'

const query = gql`
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
  const query_result = await client.query(query, {}, { fetch })

  const phrases = query_result.data?.phrases ?? []

  return {
    phrases,
  }
}
