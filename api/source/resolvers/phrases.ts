import { type GraphQLFieldResolver } from 'graphql'
import { type Resolver_Context } from '../../types/Resolver_Context'

export const phrases: GraphQLFieldResolver<void, Resolver_Context, { limit?: number }> = async (
  _,
  args,
  context,
) => {
  const limit = args.limit ?? 20
  const phrases = await context.phrases.many({ limit })

  return phrases
}
