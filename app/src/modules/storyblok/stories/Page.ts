import type { ISbStoryData, StoryblokRichTextDocumentNode } from '@storyblok/js'

export interface Page {
  title: string
  content: StoryblokRichTextDocumentNode
  metaDescription: string
  // tagline?: StoryblokRichTextDocumentNode
  // heroContent?: StoryblokRichTextDocumentNode
  // metaTitle?: string
  // metaKeywords: string
}

export interface PageStory extends Omit<Page, 'series'> {
  series?: ISbStoryData<SeriesStory>[]
}

export const getPage = (story: ISbStoryData<PageStory>): Page => {
  return story.content
}
