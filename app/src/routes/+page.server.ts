import { dev } from '$app/environment'
import type { Page } from '$storyblok/stories/Page'
import { redirect } from '@sveltejs/kit'

export const load = async (event) => {
  if (event.url.searchParams.has('query')) {
    const redirect_url = new URL(event.url)
    redirect_url.pathname = '/dictionary'

    redirect(301, redirect_url)
  }

  const page = await event.locals.storyblok.getStory<Page>('/pages', {
    resolve_relations: [],
    version: dev ? 'draft' : undefined,
  })

  return page.data.story.content
}
