/**
 * @type {import('graphql').GraphQLFieldResolver<
 *   void,
 *   Resolver_Context,
 *   { limit?: number },
 *   Phrase[]
 * >}
 */
export const phrases = async (_, args, context) => {
  let limit = args.limit ?? 20
  const phrases = await context.phrases.many({ limit })

  const result = await Promise.all(
    phrases.map(async (phrase) => {
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
    }),
  )

  return result
}
