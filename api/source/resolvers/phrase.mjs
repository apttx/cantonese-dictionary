/**
 * @type {import('graphql').GraphQLFieldResolver<
 *   void,
 *   Resolver_Context,
 *   { where: { id: string } }
 * >}
 */
export const phrase = async (_, args, context) => {
  const id = args.where.id
  const phrase = await context.phrases.one({ id })

  return phrase
}
