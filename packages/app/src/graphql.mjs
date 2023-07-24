import { Client, fetchExchange } from '@urql/core'

import { dev } from '$app/environment'
import { PUBLIC_API_URL } from '$env/static/public'

export { gql } from '@urql/core'

const url = PUBLIC_API_URL ?? 'http://localhost:4000/graphql'

if (dev) {
  console.info(
    `using \`${url}\` as api url.\n  ~~> $ echo "PUBLIC_API_URL=https://cantonese-dictionary-api.vercel.app/graphql" > .env # to use the production api`,
  )
}

export const client = new Client({
  url,
  exchanges: [fetchExchange],
})
