export const handle = ({ event, resolve }) =>
  resolve(event, { filterSerializedResponseHeaders: (name) => name === 'content-type' })
