import { Language } from '../../../types/Language'
import { Field_Resolver } from '../../types/Resolver_Context'

export const languages: Field_Resolver<Language[]> = async (_, __, context) => {
  const languages = await context.languages.many()

  return languages
}
