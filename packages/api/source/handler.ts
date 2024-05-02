import { RequestListener } from 'node:http'
import { YogaInitialContext, createYoga } from 'graphql-yoga'

import { schema } from './schema'
import {
  Language_Aspects_Datasource,
  Languages_Datasource,
  Phrases_Datasource,
  Resolver_Context,
  Videos_Datasource,
} from '../types/Resolver_Context.js'

export const handler = (options: {
  phrases: Phrases_Datasource
  languages: Languages_Datasource
  language_aspects: Language_Aspects_Datasource
  videos: Videos_Datasource
  graphiql?: boolean
  landingPage?: boolean
}): RequestListener => {
  const { phrases, languages, language_aspects, videos } = options
  const graphiql = options.graphiql ?? false
  const landingPage = options.landingPage ?? false

  const context = (initial_context: YogaInitialContext): Resolver_Context => ({
    phrases,
    languages,
    language_aspects,
    videos,
  })

  const yoga = createYoga({
    schema,
    context,
    graphiql,
    landingPage,
  })

  return yoga
}
