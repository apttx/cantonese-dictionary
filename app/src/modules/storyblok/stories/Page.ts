import type { StoryblokRichTextDocumentNode } from '@storyblok/js'

export interface Page {
  title: string
  content: StoryblokRichTextDocumentNode
  metaDescription: string
  // tagline?: StoryblokRichTextDocumentNode
  // heroContent?: StoryblokRichTextDocumentNode
  // metaTitle?: string
  // metaKeywords: string
}
