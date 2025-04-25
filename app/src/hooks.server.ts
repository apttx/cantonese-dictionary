import { getClient } from '$storyblok/getClient'

export const handle = (input) => {
  input.event.locals.storyblok = getClient(input.event.fetch)

  return input.resolve(input.event, {
    filterSerializedResponseHeaders: (name) => name === 'content-type',
  })
}
