import { fetchExchange, ssrExchange, createClient } from '@urql/core'
export { gql } from '@urql/core'

// @ts-expect-error broken types?
import { PUBLIC_API_URL } from '$env/static/public'
import { dev, browser } from '$app/environment'

const url = PUBLIC_API_URL ?? 'http://localhost:4000/graphql'

if (dev) {
  console.info(
    `using \`${url}\` as api url.\n  ~~> $ echo "PUBLIC_API_URL=https://cantonese-dictionary-api.vercel.app/graphql" > .env # to use the production api`,
  )
}

/** @deprecated Use this package's `query` export: import { query } from '$graphql' */
export const client = createClient({
  url,
  exchanges: [ssrExchange({ isClient: browser }), fetchExchange],
})

/**
 * @type {<
 *   Data = any,
 *   Variables extends import('@urql/core').AnyVariables = import('@urql/core').AnyVariables,
 * >(
 *   query: import('@urql/core').TypedDocumentNode<Data, Variables>,
 *   variables: Variables,
 *   context: { fetch: Required<import('@urql/core').OperationContext>['fetch'] },
 * ) => Promise<import('@urql/core').OperationResult<Data, Variables>>}
 */
export const query = async (query, variables, options) => {
  const body = { query: query.loc?.source.body, variables }
  const response = await options.fetch(PUBLIC_API_URL, {
    method: 'post',
    mode: 'cors',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })

  const response_json = await response.json()

  return response_json
}
