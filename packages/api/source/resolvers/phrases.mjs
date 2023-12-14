/** @type {import('graphql').GraphQLFieldResolver<void, Resolver_Context, { limit?: number }>} */
export const phrases = async (_, args, context) => {
  let limit = args.limit ?? 20
  const phrases = await context.phrases.many({ limit })

  return phrases
}
