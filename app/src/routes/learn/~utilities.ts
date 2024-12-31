import type { Routable_Language, Routable_Language_Aspect } from '$types/Language'
import type { Routable_Video } from '$types/Video'

export const get_breadcrumbs = (
  language?: Pick<Routable_Language, 'slug' | 'name'>,
  branch?:
    | {
        language_aspect: Pick<Routable_Language_Aspect, 'slug' | 'title'>
      }
    | {
        video: Pick<Routable_Video, 'slug' | 'title'>
      },
) => {
  const breadcrumbs = [
    {
      text: 'Learn',
      route: '/learn',
    },
  ]

  if (!language) {
    return breadcrumbs
  }

  breadcrumbs.push({
    text: language.name,
    route: `/learn/${language.slug}`,
  })

  if (!branch) {
    return breadcrumbs
  }

  if ('language_aspect' in branch) {
    breadcrumbs.push({
      text: branch.language_aspect.title,
      route: `/learn/${language.slug}/${branch.language_aspect.slug}`,
    })

    return breadcrumbs
  }

  if ('video' in branch) {
    breadcrumbs.push({
      text: branch.video.title,
      route: `/learn/${language.slug}/videos/${branch.video.slug}`,
    })

    return breadcrumbs
  }

  return breadcrumbs
}
