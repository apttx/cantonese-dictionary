import type {
  Rich_Text_Heading,
  Rich_Text_Image,
  Rich_Text_Text,
  Rich_Text_Subscript_Text,
  Rich_Text_Superscript_Text,
  Rich_Text_Element,
  Rich_Text_Text_Element,
  Rich_Text_Text_Link,
  Rich_Text_List,
} from '$types/Rich_Text'

// TODO: remove type from global types
type Graphql_Type<Type_Map extends Record<string, unknown>> = {
  [Typename in keyof Type_Map]: Omit<Type_Map[Typename], 'type'> & { __typename: Typename }
}[keyof Type_Map]

export type Api_Rich_Text_Text_Element = Graphql_Type<{
  Rich_Text_Text: Rich_Text_Text
  Rich_Text_Subscript_Text: Rich_Text_Subscript_Text
  Rich_Text_Superscript_Text: Rich_Text_Superscript_Text
  Rich_Text_Text_Link: Rich_Text_Text_Link
}>

export type Api_Rich_Text_Element = Graphql_Type<{
  Rich_Text_Heading: Omit<Rich_Text_Heading, 'content'> & {
    content: Api_Rich_Text_Text_Element[]
  }
  Rich_Text_Paragraph: Omit<Rich_Text_Heading, 'content'> & {
    content: Api_Rich_Text_Text_Element[]
  }
  Rich_Text_Image: Rich_Text_Image
  Rich_Text_List: Rich_Text_List
}>

export const get_rich_text_text_element = (
  api_rich_text_text_element: Api_Rich_Text_Text_Element,
): Rich_Text_Text_Element => {
  const { text, formats } = api_rich_text_text_element
  switch (api_rich_text_text_element.__typename) {
    case 'Rich_Text_Subscript_Text': {
      return {
        type: 'subscript',
        formats,
        text,
      }
    }

    case 'Rich_Text_Superscript_Text': {
      return {
        type: 'superscript',
        formats,
        text,
      }
    }

    case 'Rich_Text_Text': {
      return {
        type: 'text',
        formats,
        text,
      }
    }

    case 'Rich_Text_Text_Link': {
      const { href } = api_rich_text_text_element
      return {
        type: 'link',
        formats,
        text,
        href,
      }
    }
  }

  throw `unhandled api richtext text type ${JSON.stringify(api_rich_text_text_element)}`
}

export const get_rich_text_element = (
  api_rich_text_element: Api_Rich_Text_Element,
): Rich_Text_Element => {
  switch (api_rich_text_element.__typename) {
    case 'Rich_Text_Heading': {
      const { level } = api_rich_text_element
      const content = api_rich_text_element.content.map((api_rich_text_text_element) =>
        get_rich_text_text_element(api_rich_text_text_element),
      )

      return {
        type: 'heading',
        level,
        content,
      }
    }

    case 'Rich_Text_Paragraph': {
      const content = api_rich_text_element.content.map((api_rich_text_text_element) =>
        get_rich_text_text_element(api_rich_text_text_element),
      )

      return {
        type: 'paragraph',
        content,
      }
    }

    case 'Rich_Text_Image': {
      const { url, alt_text, height, width, caption } = api_rich_text_element

      return {
        type: 'image',
        url,
        alt_text,
        height,
        width,
        caption,
      }
    }

    case 'Rich_Text_List': {
      const { list_type, items } = api_rich_text_element

      return {
        type: 'list',
        list_type,
        items,
      }
    }
  }

  throw `unhandled api richtext type ${JSON.stringify(api_rich_text_element)}`
}
