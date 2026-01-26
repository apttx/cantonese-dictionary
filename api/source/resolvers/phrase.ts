import { type GraphQLFieldResolver } from 'graphql'
import { type Resolver_Context } from '../../types/Resolver_Context'

export const phrase: GraphQLFieldResolver<
  void,
  Resolver_Context,
  { where: { id: string } }
> = async (_, args, context) => {
  const id = args.where.id
  const phrase = await context.phrases.one({ id })

  return phrase
}
