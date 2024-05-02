import { Routable_Video } from '../../../types/Video'
import { Field_Resolver } from '../../types/Resolver_Context'

export const video: Field_Resolver<
  Routable_Video,
  { where: { slug: string; language: { slug: string } } }
> = async (_, args, context) => {
  const video = await context.videos.one({
    slug: args.where.slug,
    language_slug: args.where.language.slug,
  })

  return video
}
