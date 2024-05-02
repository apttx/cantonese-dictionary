import { Phrase } from '../../../types/Phrase'
import { Field_Resolver } from '../../types/Resolver_Context'

export const search: Field_Resolver<Phrase[], { query: string; limit?: number }> = async (
  _,
  args,
  context,
) => {
  const term = args.query
  const limit = args.limit ?? 20
  const phrases = await context.phrases.search({ term, limit })

  return phrases
}
