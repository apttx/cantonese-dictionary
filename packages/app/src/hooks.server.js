export const handle = ({ event, resolve }) =>
  resolve(event, {
    filterSerializedResponseHeaders: () => true,
  })
