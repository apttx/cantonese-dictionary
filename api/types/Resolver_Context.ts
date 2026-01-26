import { type Phrase } from '../../types/Phrase'
import type { Search_Query } from '../source/resolvers/search'

export interface Phrases_Datasource {
  search: (options: { query: Search_Query; limit: number }) => Promise<Phrase[]>
  many: (options: { limit: number }) => Promise<Phrase[]>
  one: (options: { id: string }) => Promise<Phrase>
}

export interface Resolver_Context {
  phrases: Phrases_Datasource
}
