/** @type {import('graphql').GraphQLFieldResolver<void, Resolver_Context, void, {}>} */
export const dictionary = async () => {
  return {
    chapters: {},
  }
}

/**
 * @type {import('graphql').GraphQLFieldResolver<
 *   void,
 *   Resolver_Context,
 *   void,
 *   { label: string }[]
 * >}
 */
export const english_chapters = async (_, __, { dictionary }) => {
  const english_chapters = await dictionary.english_chapters()

  return english_chapters
}
