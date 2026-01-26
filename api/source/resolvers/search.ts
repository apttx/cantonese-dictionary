import { type GraphQLFieldResolver } from 'graphql'
import { type Resolver_Context } from '../../types/Resolver_Context'

export interface Search_Query {
  english?: string
  jyutping?: string
  pinyin?: string
  traditional?: string
  simplified?: string
}

export const search: GraphQLFieldResolver<
  void,
  Resolver_Context,
  { query: Search_Query; limit?: number }
> = async (_, args, context) => {
  const query = args.query
  const limit = args.limit ?? 20
  const phrases = await context.phrases.search({ query, limit })

  return phrases
}
