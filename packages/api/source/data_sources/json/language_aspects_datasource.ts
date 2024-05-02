import { Language_Aspects_Datasource } from '../../../types/Resolver_Context'
import { languages } from './content/languages'

export const get_language_aspects_datasource = (): Language_Aspects_Datasource => {
  const one: Language_Aspects_Datasource['one'] = async (options) => {
    const language = languages.find((language) => language.slug === options.language_slug)

    if (!language) {
      throw new Error(`there is no language with slug ${JSON.stringify(options.language_slug)}`)
    }

    const aspect = language.aspects.find((aspect) => aspect.slug === options.slug)

    if (!aspect) {
      throw new Error(
        `there is no language aspect with slug ${JSON.stringify(options.slug)} for language with slug ${JSON.stringify(options.language_slug)}`,
      )
    }

    return aspect
  }

  const many: Language_Aspects_Datasource['many'] = async () => {
    return languages.map((language) => language.aspects).flat()
  }

  const datasource: Language_Aspects_Datasource = {
    one,
    many,
  }

  return datasource
}
