import { createSchema } from 'graphql-yoga'

import { type_definitions } from './type_definitions'
import { search } from './resolvers/search'
import { phrases } from './resolvers/phrases'
import { phrase } from './resolvers/phrase'
import { languages } from './resolvers/languages'
import { language } from './resolvers/language'
import { resolve_routable_video_type } from './resolvers/routable_video'
import { video } from './resolvers/video'
import { language_aspect } from './resolvers/language_aspect'
import { resolve_rich_text_element_type } from './resolvers/rich_text_element'
import { resolve_rich_text_text_element_type } from './resolvers/rich_text_text_element'

export const schema = createSchema({
  typeDefs: type_definitions,
  resolvers: {
    Query: {
      search,
      phrases,
      phrase,
      languages,
      language,
      language_aspect,
      video,
    },
    Routable_Video: {
      __resolveType: resolve_routable_video_type,
    },
    Rich_Text_Element: {
      __resolveType: resolve_rich_text_element_type,
    },
    Rich_Text_Text_Element: {
      __resolveType: resolve_rich_text_text_element_type,
    },
  },
})
