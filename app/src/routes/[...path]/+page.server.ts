import { dev } from '$app/environment'
import { getPage, type PageStory } from '$storyblok/stories/Page'
import { error } from '@sveltejs/kit'
import { type Config } from '@sveltejs/adapter-vercel'

export const config: Config = {
  isr: {
    expiration: false,
  },
}

const version = dev ? 'draft' : undefined

export const load = async (event) => {
  try {
    const breadcrumbSlugsString = event.params.path
      .replace(/^\/|\/$/, '')
      .split('/')
      .slice(0, -1)
      .map((_, index, slugs) => {
        const path = slugs.slice(0, index + 1)
        const pathString = path.join(`/`)
        const slugsString = `pages/${pathString},pages/${pathString}/`

        return slugsString
      })
      .join(',')
    const slug = `pages/${event.params.path}`
    const [breadcrumbsResult, pageResult] = await Promise.all([
      // no need to run a query that will return an empty array
      breadcrumbSlugsString.length
        ? event.locals.storyblok.getStories<PageStory>({
            version,
            by_slugs: breadcrumbSlugsString,
          })
        : { data: { stories: [] } },
      event.locals.storyblok.getStory<PageStory>(slug, {
        version,
        resolve_relations: 'page.series,series.pages,seriesTeaser.series',
      }),
    ])

    const breadcrumbs = breadcrumbsResult.data.stories.map((page) => {
      const pathname = page.full_slug.replace(/^\/?pages/, '')
      const title = page.content.title

      return {
        title,
        pathname,
      }
    })

    const pathname = pageResult.data.story.full_slug.replace(/^\/?pages/, '')
    const title = pageResult.data.story.content.title
    breadcrumbs.push({
      title,
      pathname,
    })

    const page = getPage(pageResult.data.story)

    return {
      ...page,
      breadcrumbs,
    }
  } catch (throwable) {
    if (
      typeof throwable === 'object' &&
      throwable &&
      'status' in throwable &&
      typeof throwable.status === 'number'
    ) {
      error(throwable.status)
    }

    error(500)
  }
}
