import { GraphQLTypeResolver } from 'graphql'
import { Routable_Abstract_Video, Routable_YouTube_Video } from '../../../types/Video'
import { Resolver_Context } from '../../types/Resolver_Context'

export const resolve_routable_video_type: GraphQLTypeResolver<
  Routable_Abstract_Video | Routable_YouTube_Video,
  Resolver_Context
> = (source) => {
  if ('video_id' in source) {
    return 'Routable_YouTube_Video'
  }

  return 'Routable_Video'
}
