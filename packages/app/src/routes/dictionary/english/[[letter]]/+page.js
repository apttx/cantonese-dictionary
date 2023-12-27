import { gql } from '@urql/core'
import { error } from '@sveltejs/kit'

import { client } from '$graphql'
import { phrase_fragment } from '../../phrase_fragment.mjs'

/**
 * @type {import('@urql/core').TypedDocumentNode<
 *   { phrases: Phrase[]; dictionary: { chapters: { english: { label: string }[] } } },
 *   void
 * >}
 */
const phrases_query = gql`
  {
    dictionary {
      chapters {
        english {
          label
        }
      }
    }
    phrases {
      ...phrase_fragment
    }
  }
  ${phrase_fragment}
`

export const load = async ({ params }) => {
  const current_chapter_label = params.letter?.toUpperCase()
  const query_result = await client.query(phrases_query, undefined).toPromise()

  if (!query_result.data) {
    error(500, query_result.error)
  }

  const chapters = query_result.data.dictionary.chapters.english.map((chapter) => {
    const label = chapter.label
    const link = `/dictionary/english/${chapter.label.toLowerCase()}`

    const tab = {
      label,
      link,
    }

    return tab
  })
  const active_chapter = chapters.find((chapter) => chapter.label === current_chapter_label)

  const phrases = query_result.data.phrases

  return {
    chapters,
    active_chapter,
    phrases,
  }
}
