import { Phrase } from './Phrase'
import { Video } from './Video'

export interface Topic {
  title: string
  videos: Video[]
  /** list of words or expressions that can cause text to be classified under this topic */
  keywords: Phrase[]
}
