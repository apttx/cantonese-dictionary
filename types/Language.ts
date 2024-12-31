import type { Rich_Text_Element } from './Rich_Text'
import type { Routable } from './Routable'
import type { Routable_Video } from './Video'

export interface Language_Aspect {
  color: string
  title: string
  description: string
  content: Rich_Text_Element[]
}

export interface Routable_Language_Aspect extends Language_Aspect, Routable {}

export interface Language {
  color: string
  name: string
  iso_639_code: string
  aspects: Language_Aspect[]
  introduction: string
  videos: Routable_Video[]
}

export interface Routable_Language extends Language, Routable {
  aspects: Routable_Language_Aspect[]
}
