import { type Phrase } from '../../types/Phrase'

export interface Phrases_Datasource {
  search: (options: { term: string; limit: number }) => Promise<Phrase[]>
  many: (options: { limit: number }) => Promise<Phrase[]>
  one: (options: { id: string }) => Promise<Phrase>
}

export interface Resolver_Context {
  phrases: Phrases_Datasource
}
