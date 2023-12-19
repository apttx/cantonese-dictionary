export const handle = ({ event, resolve }) =>
  resolve(event, {
    filterSerializedResponseHeaders: () => true,
  })

export const handleFetch = async ({ request, fetch }) => {
  console.debug(request)

  return fetch(request)
}
