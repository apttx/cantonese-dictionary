import { Routable_Language_Aspect } from '../../../../../../types/Language'
import { Routable } from '../../../../../../types/Routable'
import { get_slug, get_string_color } from '../~utilities'

export const get_language_aspect = <
  Options extends Omit<Routable_Language_Aspect, keyof Routable | 'color'>,
>(
  options: Options,
) => {
  const slug = get_slug(options.title)
  const color = get_string_color(slug)
  const route = `/learn/${slug}`

  const aspect = {
    ...options,
    route,
    slug,
    color,
  }

  return aspect
}
