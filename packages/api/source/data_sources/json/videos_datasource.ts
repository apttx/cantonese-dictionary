import { Videos_Datasource } from '../../../types/Resolver_Context'
import { languages } from './content/languages'

export const get_videos_datasource = (): Videos_Datasource => {
  const one: Videos_Datasource['one'] = async (options) => {
    const language = languages.find((language) => language.slug === options.language_slug)

    if (!language) {
      throw new Error(`there is no language with slug ${JSON.stringify(options.language_slug)}`)
    }

    const video = language.videos.find((video) => video.slug === options.slug)

    if (!video) {
      throw new Error(
        `there is no video with slug ${JSON.stringify(options.slug)} for language with slug ${JSON.stringify(options.language_slug)}`,
      )
    }

    return video
  }

  const many: Videos_Datasource['many'] = async () => {
    return languages.map((language) => language.videos).flat()
  }

  const datasource: Videos_Datasource = {
    one,
    many,
  }

  return datasource
}
