import type { GenericStoryblokClient } from './GenericStoryblokClient'
import { STORYBLOK_ACCESS_TOKEN } from '$env/static/private'
import { apiPlugin, storyblokInit as getStoryblokInit } from '@storyblok/js'
import { dev } from '$app/environment'

export const getClient = (fetch: typeof globalThis.fetch): GenericStoryblokClient => {
  const storyblokInit = getStoryblokInit({
    accessToken: STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
    apiOptions: {
      fetch: fetch,
    },
  })

  if (!storyblokInit.storyblokApi) {
    throw new Error(`unable to initialize storyblok api`)
  }

  // only uncached requests during development
  if (dev) {
    storyblokInit.storyblokApi.clearCacheVersion()
  }

  return storyblokInit.storyblokApi as GenericStoryblokClient
}
