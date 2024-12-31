import type { RouteParams } from './$types'
import { client, gql } from '$graphql'
import type { Routable_Language } from '$types/Language'
import { error } from '@sveltejs/kit'
import { get_breadcrumbs } from '../~utilities'
import { dev } from '$app/environment'

export const prerender = true

export const entries = async () => {
  const languages_result = await client.query(languages_query, {})
  const languages = languages_result.data ? languages_result.data.languages : []

  const entries = languages.map((language): RouteParams => {
    return {
      language_slug: language.slug,
    }
  })

  return entries
}

export const load = async ({ params: { language_slug } }) => {
  const language_result = await client.query(language_query, { slug: language_slug })

  if (!language_result.data) {
    if (dev) {
      console.debug({
        [`language:${language_slug}.load`]: language_result.error,
      })
    }

    error(404)
  }

  const language = language_result.data.language
  const breadcrumbs = get_breadcrumbs(language)

  return {
    ...language,
    breadcrumbs,
  }
}

// at the end, because gql syntax highlighting switches for the entire file for some reason
const languages_query = gql<{
  languages: Pick<Routable_Language, 'slug'>[]
}>/* GraphQL */ `
  {
    languages {
      slug
    }
  }
`
const language_query = gql<
  {
    language: Pick<Routable_Language, 'name' | 'slug' | 'introduction'> & {
      aspects: Pick<Routable_Language['aspects'][0], 'title' | 'slug' | 'description' | 'color'>[]
      videos: Pick<Routable_Language['videos'][0], 'title' | 'thumbnail' | 'slug'>[]
    }
  },
  { slug: string }
>/* GraphQL */ `
  query ($slug: String!) {
    language(where: { slug: $slug }) {
      slug
      name
      introduction
      aspects {
        slug
        title
        description
        color
      }
      videos {
        ... on Routable_Abstract_Video {
          title
          slug
          thumbnail {
            url
          }
        }
      }
    }
  }
`
