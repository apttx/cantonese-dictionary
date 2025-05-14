import type { ISbStoryData, StoryblokComponentType } from '@storyblok/js'
import { getSeries, type Series, type SeriesStory } from '$storyblok/stories/Series'

export interface SeriesTeaserBlock extends StoryblokComponentType<'seriesTeaser'> {
  series: ISbStoryData<SeriesStory>[]
  showHeadings?: boolean
  headingTemplate?: string
}

export interface SeriesTeaser extends Omit<SeriesTeaserBlock, 'series'> {
  series: Series[]
}

export const getSeriesTeaser = (block: SeriesTeaserBlock): SeriesTeaser => {
  const series = block.series.map(getSeries)

  return {
    ...block,
    series,
  }
}
