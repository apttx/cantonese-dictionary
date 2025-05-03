import type { ISbStoryData, StoryblokRichTextDocumentNode } from '@storyblok/js'

export interface PageStory {
  title: string
  content: StoryblokRichTextDocumentNode
  metaDescription: string
}

export interface Page extends PageStory {
  route: string
}

export const getPage = (story: ISbStoryData<PageStory>): Page => {
  const route = story.full_slug.replace(/^pages\/|\/$/, '')

  return {
    ...story.content,
    route,
  }
}
