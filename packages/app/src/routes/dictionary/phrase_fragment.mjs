import { gql } from '$graphql'

export const phrase_fragment = gql`
  fragment phrase_fragment on Phrase {
    id
    traditional
    simplified
    pinyin
    jyutping
    english
  }
`
