import { Language } from '../../../types/Language'
import { Field_Resolver } from '../../types/Resolver_Context'

export const language: Field_Resolver<Language, { where: { slug: string } }> = async (
  _,
  args,
  context,
) => {
  const language = await context.languages.one(args.where)

  return language
}
