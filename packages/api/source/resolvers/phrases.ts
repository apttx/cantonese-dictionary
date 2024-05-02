import { Phrase } from '../../../types/Phrase'
import { Field_Resolver } from '../../types/Resolver_Context'

export const phrases: Field_Resolver<Phrase[], { limit?: number }> = async (_, args, context) => {
  let limit = args.limit ?? 20
  const phrases = await context.phrases.many({ limit })

  return phrases
}
