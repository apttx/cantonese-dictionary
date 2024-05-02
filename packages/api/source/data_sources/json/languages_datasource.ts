import { Languages_Datasource } from '../../../types/Resolver_Context'
import { languages } from './content/languages'

export const get_languages_datasource = (): Languages_Datasource => {
  const one: Languages_Datasource['one'] = async (options) => {
    const language = languages.find((language) => language.slug === options.slug)

    if (!language) {
      throw new Error(`there is no language with slug ${JSON.stringify(options.slug)}`)
    }

    return language
  }

  const many: Languages_Datasource['many'] = async () => {
    return languages
  }

  const datasource: Languages_Datasource = {
    one,
    many,
  }

  return datasource
}
