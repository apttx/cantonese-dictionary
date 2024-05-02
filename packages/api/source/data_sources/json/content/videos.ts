import { Routable } from '../../../../../types/Routable'
import { Routable_Video, YouTube_Video } from '../../../../../types/Video'
import { get_slug } from './~utilities'

const get_video = <Options extends Omit<Routable_Video, keyof Routable>>(options: Options) => {
  const slug = get_slug(options.title)

  const video = {
    ...options,
    slug,
  }

  return video
}

export const videos: Routable_Video[] = [
  get_video({
    thumbnail: {
      url: 'https://i.ytimg.com/vi/CGIr_sf2lQI/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCB39j7d1XW5fqKJCKTJ1nJvJyWyg',
    },
    type: 'youtube',
    video_id: 'CGIr_sf2lQI',
    title:
      '【新家開箱】Home Tour春家在曼徹斯特的家🏠全屋大公開 @ChunsFamily #hometour #英國生活 #新家 in Manchester',
    transcript: {
      tracks: [],
    },
  }) satisfies YouTube_Video,
]
