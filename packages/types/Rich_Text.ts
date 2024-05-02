// TODO: remove the `type` property from the types in this package. the type property is only necessary for the app and the app should add these itself.

export type Format = 'bold' | 'italic' | 'line_through' | 'underline'

interface Abstract_Rich_Text_Text<Type extends string> {
  type: Type
  text: string
  formats: Format[]
}

export interface Rich_Text_Text extends Abstract_Rich_Text_Text<'text'> {}

export interface Rich_Text_Subscript_Text
  extends Abstract_Rich_Text_Text<'subscript'> {}

export interface Rich_Text_Superscript_Text
  extends Abstract_Rich_Text_Text<'superscript'> {}

export interface Rich_Text_Text_Link extends Abstract_Rich_Text_Text<'link'> {
  text: string
  href: string
  formats: Format[]
}

export type Rich_Text_Text_Element =
  | Rich_Text_Text
  | Rich_Text_Subscript_Text
  | Rich_Text_Superscript_Text
  | Rich_Text_Text_Link

interface Abstract_Rich_Text_Text_Block<Type extends string> {
  type: Type
  content: Rich_Text_Text_Element[]
}

export interface Rich_Text_Heading
  extends Abstract_Rich_Text_Text_Block<'heading'> {
  level: 2 | 3
}

export interface Rich_Text_Paragraph
  extends Abstract_Rich_Text_Text_Block<'paragraph'> {}

export interface Rich_Text_Image {
  type: 'image'
  url: string
  height: number
  width: number
  alt_text: string
  caption?: string
}

export interface Rich_Text_List {
  type: 'list'
  list_type: 'ordered' | 'unordered'
  items: {
    content: Rich_Text_Text_Element[]
  }[]
}

export type Rich_Text_Element =
  | Rich_Text_Heading
  | Rich_Text_Paragraph
  | Rich_Text_Image
  | Rich_Text_List
