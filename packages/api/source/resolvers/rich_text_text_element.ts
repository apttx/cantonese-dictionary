import { GraphQLTypeResolver } from 'graphql'
import { Resolver_Context } from '../../types/Resolver_Context'
import { Rich_Text_Text_Element } from '../../../types/Rich_Text'

export const resolve_rich_text_text_element_type: GraphQLTypeResolver<
  Rich_Text_Text_Element,
  Resolver_Context
> = (source) => {
  if (source.type === 'subscript') {
    return 'Rich_Text_Subscript_Text'
  }

  if (source.type === 'superscript') {
    return 'Rich_Text_Superscript_Text'
  }

  if (source.type === 'link') {
    return 'Rich_Text_Text_Link'
  }

  return 'Rich_Text_Text'
}
