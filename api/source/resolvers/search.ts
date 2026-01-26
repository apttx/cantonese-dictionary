import { type GraphQLFieldResolver } from 'graphql'
import { type Resolver_Context } from '../../types/Resolver_Context'

export const search: GraphQLFieldResolver<
  void,
  Resolver_Context,
  { query: string; limit?: number }
> = async (_, args, context) => {
  const term = args.query
  const limit = args.limit ?? 20
  const phrases = await context.phrases.search({ term, limit })

  return phrases
}
