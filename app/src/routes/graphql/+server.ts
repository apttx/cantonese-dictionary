import { handler as getHandler } from '$api/source/handler.ts'
import { get_datasource } from '$api/source/data_sources/sqlite_remote.ts'
import { REMOTE_DATABASE_AUTH_TOKEN, REMOTE_DATABASE_URL } from '$env/static/private'
import type { RequestHandler } from '@sveltejs/kit'

const phrases = get_datasource({
  authToken: REMOTE_DATABASE_AUTH_TOKEN,
  url: REMOTE_DATABASE_URL,
})

const handler = getHandler({
  phrases,
})

export const fallback: RequestHandler = async (event) => {
  const response = await handler(event)

  return new Response(response.body, response)
}
