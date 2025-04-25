import type { ISbStories, ISbStory, StoryblokClient } from '@storyblok/js'

export interface GenericStoryblokClient extends StoryblokClient {
  getStory<Story>(...args: Parameters<StoryblokClient['getStory']>): Promise<ISbStory<Story>>
  getStories<Story>(...args: Parameters<StoryblokClient['getStories']>): Promise<ISbStories<Story>>
}
