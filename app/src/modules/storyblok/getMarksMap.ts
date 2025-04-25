import { MarkTypes, type StoryblokRichTextDocumentNode } from '@storyblok/js'

export type SimpleMarksMap = {
  [MarkType in MarkTypes]?: true
}

export interface MarksMap extends Omit<SimpleMarksMap, MarkTypes.ANCHOR | MarkTypes.LINK> {
  [MarkTypes.ANCHOR]?: string
  [MarkTypes.LINK]?: string
  isEmpty: boolean
  href?: string
}

export const getMarksMap = (marks?: StoryblokRichTextDocumentNode[]): MarksMap => {
  if (!marks?.length) {
    return {
      isEmpty: true,
    }
  }

  const entries = marks.map((mark) => {
    switch (mark.type) {
      case MarkTypes.ANCHOR:
        return [mark.type, mark.attrs?.url] as const
      case MarkTypes.LINK:
        switch (mark.attrs?.linktype) {
          case 'story':
            return [mark.type, mark.attrs.href?.replace(/^\/?pages/, '')] as const

          case 'url':
            return [mark.type, mark.attrs.href] as const
        }
    }

    return [mark.type, true] as const
  })

  const markTypesMap = Object.fromEntries(entries) as Pick<MarksMap, MarkTypes>

  const marksMap: MarksMap = {
    ...markTypesMap,
    isEmpty: false,
    href: markTypesMap[MarkTypes.ANCHOR] ?? markTypesMap[MarkTypes.LINK],
  }

  return marksMap
}
