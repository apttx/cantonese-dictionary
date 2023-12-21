/**
 * @type {import('graphql').GraphQLFieldResolver<
 *   void,
 *   Resolver_Context,
 *   { where: { id: string } },
 *   Phrase
 * >}
 */
export const phrase = async (_, args, context) => {
  const id = args.where.id
  const phrase = await context.phrases.one({ id })

  const [traditional_hanzi, simplified_hanzi] = await Promise.all([
    context.hanzi.from_text(phrase.traditional),
    context.hanzi.from_text(phrase.simplified),
  ])

  const result = {
    ...phrase,
    traditional_hanzi,
    simplified_hanzi,
  }

  return result
}
