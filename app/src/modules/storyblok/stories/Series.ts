import type { ISbStoryData } from '@storyblok/js'
import { getPage, type Page, type PageStory } from './Page'

export interface SeriesStory {
  title: string
  pages?: ISbStoryData<PageStory>[]
}

export interface Series extends Omit<SeriesStory, 'pages'> {
  id: number
  pages: Page[]
}

export const getSeries = (story: ISbStoryData<SeriesStory>): Series => {
  const id = story.id

  // ignore references, only map resolved story data
  if (!story.content.pages?.length || typeof story.content.pages === 'string') {
    return {
      ...story.content,
      id,
      pages: [],
    }
  }

  const pages = story.content.pages.map(getPage)

  return {
    ...story.content,
    id,
    pages,
  }
}
