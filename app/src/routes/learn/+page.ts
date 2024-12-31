import { client, gql } from '$graphql'
import type { Routable_Language } from '$types/Language'
import { get_breadcrumbs } from './~utilities'

const languages_query = gql<{
  languages: Pick<Routable_Language, 'name' | 'iso_639_code' | 'slug' | 'color' | 'introduction'>[]
}>`
  {
    languages {
      slug
      name
      introduction
      iso_639_code
      color
    }
  }
`

export const load = async () => {
  const languages_result = await client.query(languages_query, {})

  const languages = languages_result.data ? languages_result.data.languages : []

  const breadcrumbs = get_breadcrumbs()

  return {
    languages,
    breadcrumbs,
  }
}
