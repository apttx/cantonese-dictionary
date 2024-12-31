import { error } from '@sveltejs/kit'
import type { RouteParams } from './$types'
import { client, gql } from '$graphql'
import type { Routable_Language, Routable_Language_Aspect } from '$types/Language'
import { dev } from '$app/environment'
import { get_breadcrumbs } from '../../~utilities'
import { get_rich_text_element, type Api_Rich_Text_Element } from '$modules/api'

export const load = async ({ params: { aspect_slug, language_slug } }) => {
  const language_aspect_result = await client.query(language_aspect_query, {
    slug: aspect_slug,
    language_slug,
  })

  if (!language_aspect_result.data) {
    if (dev) {
      console.debug({
        [`language:${language_slug}/aspect:${aspect_slug}.load`]: language_aspect_result.error,
      })
    }

    error(404)
  }

  const { language_aspect, language } = language_aspect_result.data

  const breadcrumbs = get_breadcrumbs(language, { language_aspect })

  const content = language_aspect.content.map((api_rich_text_element) =>
    get_rich_text_element(api_rich_text_element),
  )

  return {
    ...language_aspect,
    content,
    breadcrumbs,
  }
}

export const prerender = true

export const entries = async () => {
  const languages_result = await client.query(languages_query, {})
  const languages = languages_result.data ? languages_result.data.languages : []

  const entries = languages
    .map((language) => {
      const entries = language.aspects.map((aspect): RouteParams => {
        return {
          language_slug: language.slug,
          aspect_slug: aspect.slug,
        }
      })

      return entries
    })
    .flat()

  return entries
}

// at the end, because gql syntax highlighting switches for the entire file for some reason
const languages_query = gql<{
  languages: (Pick<Routable_Language, 'slug'> & {
    aspects: Pick<Routable_Language['aspects'][0], 'slug'>[]
  })[]
}>/* GraphQL */ `
  {
    languages {
      slug
      aspects {
        slug
      }
    }
  }
`

const rich_text_text_fragment = gql`
  fragment Rich_Text_Content on Rich_Text_Text_Element {
    ... on Abstract_Rich_Text_Text_Element {
      __typename
      formats
      text
    }

    ... on Rich_Text_Text_Link {
      href
    }
  }
`

const language_aspect_query = gql<
  {
    language_aspect: Pick<Routable_Language_Aspect, 'slug' | 'title' | 'description'> & {
      content: Api_Rich_Text_Element[]
    }
    language: Pick<Routable_Language, 'slug' | 'name'>
  },
  { slug: string; language_slug: string }
>/* GraphQL */ `
  query ($slug: String!, $language_slug: String!) {
    language_aspect(where: { slug: $slug, language: { slug: $language_slug } }) {
      slug
      title
      description

      content {
        __typename
        ... on Rich_Text_Heading {
          level
          content {
            ...Rich_Text_Content
          }
        }
        ... on Rich_Text_Paragraph {
          content {
            ...Rich_Text_Content
          }
        }
        ... on Rich_Text_Image {
          url
          alt_text
          height
          width
          caption
        }
        ... on Rich_Text_List {
          list_type
          items {
            content {
              ...Rich_Text_Content
            }
          }
        }
      }
    }
    language(where: { slug: $language_slug }) {
      slug
      name
    }
  }
  ${rich_text_text_fragment}
`
