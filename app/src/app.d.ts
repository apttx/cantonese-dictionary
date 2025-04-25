import type { GenericStoryblokClient } from '$storyblok/GenericStoryblokClient'

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      storyblok: GenericStoryblokClient
    }
    // interface PageData {}
    // interface Platform {}
  }
}

export {}
