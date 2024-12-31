import { client } from '$graphql'
import type { Routable_Language } from '$types/Language'
import type { Routable_Video, Routable_YouTube_Video } from '$types/Video'
import { error } from '@sveltejs/kit'
import { gql } from '@urql/core'
import type { RouteParams } from './$types'
import { get_breadcrumbs } from '../../../~utilities'
import { dev } from '$app/environment'
import type { Transcript } from '$types/Transcript'

export const load = async ({ params: { video_slug, language_slug } }) => {
  const video_result = await client.query(video_query, {
    slug: video_slug,
    language_slug,
  })

  if (!video_result.data) {
    if (dev) {
      console.debug({ [`language:${language_slug}/video:${video_slug}.load`]: video_result.error })
    }

    error(404)
  }

  const { language } = video_result.data

  const transcript: Transcript = {
    tracks: [],
  }

  const data =
    video_result.data.video.__typename === 'Routable_YouTube_Video'
      ? {
          ...video_result.data.video,
          transcript,
          type: 'youtube' as const,
          breadcrumbs: get_breadcrumbs(language, { video: video_result.data.video }),
        }
      : {
          ...video_result.data.video,
          transcript,
          type: 'other' as const,
          breadcrumbs: get_breadcrumbs(language, { video: video_result.data.video }),
        }

  return data
}

export const prerender = true

export const entries = async () => {
  const languages_result = await client.query(languages_query, {})
  const languages = languages_result.data ? languages_result.data.languages : []

  const entries = languages
    .map((language) => {
      const entries = language.videos.map((video): RouteParams => {
        return {
          language_slug: language.slug,
          video_slug: video.slug,
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
    videos: Pick<Routable_Language['videos'][0], 'slug'>[]
  })[]
}>/* GraphQL */ `
  {
    languages {
      slug
      videos {
        ... on Routable_Abstract_Video {
          slug
        }
      }
    }
  }
`

type Api_Video =
  | (Pick<Routable_Video, 'slug' | 'title'> & { __typename: 'Routable_Abstract_Video' })
  | (Pick<Routable_YouTube_Video, 'slug' | 'title' | 'video_id'> & {
      __typename: 'Routable_YouTube_Video'
    })

const video_query = gql<
  {
    video: Api_Video
    language: Pick<Routable_Language, 'slug' | 'name'>
  },
  { slug: string; language_slug: string }
>/* GraphQL */ `
  query ($slug: String!, $language_slug: String!) {
    video(where: { slug: $slug, language: { slug: $language_slug } }) {
      __typename
      ... on Routable_Abstract_Video {
        slug
        title
        # transcript
      }
      ... on Abstract_YouTube_Video {
        video_id
      }
    }
    language(where: { slug: $language_slug }) {
      slug
      name
    }
  }
`
