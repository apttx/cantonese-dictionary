import { Routable_Language_Aspect } from '../../../types/Language'
import { Field_Resolver } from '../../types/Resolver_Context'

export const language_aspect: Field_Resolver<
  Routable_Language_Aspect,
  { where: { slug: string; language: { slug: string } } }
> = async (_, args, context) => {
  const language_aspect = await context.language_aspects.one({
    slug: args.where.slug,
    language_slug: args.where.language.slug,
  })

  return language_aspect
}
