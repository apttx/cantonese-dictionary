import type { Routable } from './Routable'
import type { Transcript } from './Transcript'

interface Abstract_Video {
  title: string
  transcript: Transcript
  thumbnail: {
    url: string
  }
}

export interface YouTube_Video extends Abstract_Video {
  type: 'youtube'
  video_id: string
}

export interface Routable_YouTube_Video extends YouTube_Video, Routable {}

export type Routable_Video = Routable_YouTube_Video

export type Video = YouTube_Video
