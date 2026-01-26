import * as Phrase from './types/Phrase.ts'
import * as Query from './types/Query.ts'

export const type_definitions = [...Object.values(Phrase), ...Object.values(Query)]
