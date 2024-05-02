import { Phrase } from '../../../types/Phrase'
import { Field_Resolver } from '../../types/Resolver_Context'

export const phrase: Field_Resolver<Phrase, { where: { id: string } }> = async (
  _,
  args,
  context,
) => {
  const id = args.where.id
  const phrase = await context.phrases.one({ id })

  return phrase
}
