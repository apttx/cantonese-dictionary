/**
 * @type {import('graphql').GraphQLFieldResolver<
 *   void,
 *   Resolver_Context,
 *   { text: string },
 *   Hanzi[]
 * >}
 */
export const hanzi = async (_, args, context) => {
  const text = args.text
  const hanzi = await context.hanzi.from_text(text)

  return hanzi
}
