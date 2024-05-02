import { GraphQLFieldResolver } from 'graphql'
import { Phrase } from '../../types/Phrase'
import { Routable_Language, Routable_Language_Aspect } from '../../types/Language'
import { Routable_Video } from '../../types/Video'

export interface Phrases_Datasource {
  search: (options: { term: string; limit: number }) => Promise<Phrase[]>
  many: (options: { limit: number }) => Promise<Phrase[]>
  one: (options: { id: string }) => Promise<Phrase>
}

export interface Languages_Datasource {
  many: () => Promise<Routable_Language[]>
  one: (options: { slug: string }) => Promise<Routable_Language>
}

export interface Language_Aspects_Datasource {
  many: () => Promise<Routable_Language_Aspect[]>
  one: (options: { slug: string; language_slug: string }) => Promise<Routable_Language_Aspect>
}

export interface Videos_Datasource {
  many: () => Promise<Routable_Video[]>
  one: (options: { slug: string; language_slug: string }) => Promise<Routable_Video>
}

export interface Resolver_Context {
  phrases: Phrases_Datasource
  languages: Languages_Datasource
  language_aspects: Language_Aspects_Datasource
  videos: Videos_Datasource
}

export type Field_Resolver<Result, Arguments = void, Parent = void> =
  | GraphQLFieldResolver<Parent, Resolver_Context, Arguments, Result>
  | GraphQLFieldResolver<Parent, Resolver_Context, Arguments, Promise<Result>>
