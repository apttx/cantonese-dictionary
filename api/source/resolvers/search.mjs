/**
 * @type {import('graphql').GraphQLFieldResolver<
 *   void,
 *   Resolver_Context,
 *   { query: string; limit?: number }
 * >}
 */
export const search = async (_, args, context) => {
  const term = args.query
  const limit = args.limit ?? 20
  const phrases = await context.phrases.search({ term, limit })

  return phrases
}
