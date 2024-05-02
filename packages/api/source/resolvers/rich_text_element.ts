import { GraphQLTypeResolver } from 'graphql'
import { Resolver_Context } from '../../types/Resolver_Context'
import { Rich_Text_Element } from '../../../types/Rich_Text'

export const resolve_rich_text_element_type: GraphQLTypeResolver<
  Rich_Text_Element,
  Resolver_Context
> = (source) => {
  if ('url' in source) {
    return 'Rich_Text_Image'
  }

  if ('level' in source) {
    return 'Rich_Text_Heading'
  }

  if ('items' in source) {
    return 'Rich_Text_List'
  }

  return 'Rich_Text_Paragraph'
}
