import type { StoryblokComponentType, StoryblokRichTextDocumentNode } from '@storyblok/js'

export interface ContainerBlock extends StoryblokComponentType<'container'> {
  content: StoryblokRichTextDocumentNode
  width: 'text' | 'page' | 'layout'
}
