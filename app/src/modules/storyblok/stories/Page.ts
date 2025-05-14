import type { ISbStoryData, StoryblokRichTextDocumentNode } from '@storyblok/js'
import { getSeries, type Series, type SeriesStory } from './Series'

export interface PageStory {
  title: string
  content: StoryblokRichTextDocumentNode
  metaDescription: string
  series?: ISbStoryData<SeriesStory>[]
}

export interface Page extends Omit<PageStory, 'series'> {
  id: number
  route: string
  series: Series[]
}

export const getPage = (story: ISbStoryData<PageStory>): Page => {
  const route = `/${story.full_slug.replace(/^pages\/|\/$/, '')}`
  const id = story.id

  // ignore references, only map resolved story data
  if (!story.content.series?.length || typeof story.content.series[0] === 'string') {
    const page = {
      ...story.content,
      id,
      route,
      series: [],
    }

    return page
  }

  const series = story.content.series.map(getSeries)

  return {
    ...story.content,
    id,
    route,
    series,
  }
}
