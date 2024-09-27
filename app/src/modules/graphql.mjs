import { fetchExchange, createClient } from '@urql/core'
export { gql } from '@urql/core'

// @ts-expect-error broken types?
import { PUBLIC_API_URL } from '$env/static/public'
import { dev } from '$app/environment'

const url = PUBLIC_API_URL ?? 'http://localhost:4000/graphql'

if (dev) {
  console.info(
    `using \`${url}\` as api url.\n  ~~> $ echo "PUBLIC_API_URL=https://cantonese-dictionary-api.vercel.app/graphql" > .env # to use the production api`,
  )
}

export const client = createClient({
  url,
  exchanges: [fetchExchange],
})
