import type { Op } from 'quill/core'
import type {
  Format,
  Rich_Text_Element,
  Rich_Text_Image,
  Rich_Text_Text_Element,
} from '$types/Rich_Text'

type Typed_Op<Insert extends string | Record<string, unknown>> = Omit<Op, 'insert'> & {
  insert: Insert
}

const is_string = (op: Op): op is Typed_Op<string> => typeof op.insert === 'string'
const is_image = (op: Op): op is Typed_Op<{ image: string }> =>
  typeof op.insert === 'object' && 'image' in op.insert

const available_formats = new Set<Format>(['bold', 'italic', 'line_through', 'underline'])

const get_formats = (attributes: Record<string, unknown>) => {
  const attributes_keys = Object.keys(attributes).map((key) => {
    if (key === 'line-through') {
      return 'line_through'
    }

    return key
  })
  const formats = attributes_keys.filter((string): string is Format =>
    available_formats.has(string as Format),
  )

  return formats
}

const is_valid_text_block_content = (content: Rich_Text_Text_Element[]) => {
  // don't submit empty paragraphs
  const has_non_whitespace_element = content.some((text_element) => {
    const is_non_whitespace = text_element.text.trim().length !== 0

    return is_non_whitespace
  })

  if (has_non_whitespace_element) {
    return true
  }

  const is_empty = !content.length
  if (!is_empty) {
    return true
  }

  return false
}

const get_sanitized_paragraph_content = (content: Rich_Text_Text_Element[]) => {
  const last_index = content.length - 1
  const sanitized_paragraph_content = content.filter((text_element, index, all_text_elements) => {
    const is_empty = text_element.text.length === 0

    if (is_empty) {
      return false
    }

    const is_only_whitespace = text_element.text.trim().length === 0

    const is_first = index === 0
    if (is_first && is_only_whitespace) {
      return false
    }

    const is_last = index === last_index
    if (is_last && is_only_whitespace) {
      return false
    }

    const is_previous_only_whitespace = all_text_elements[index - 1]?.text.trim().length === 0
    if (is_previous_only_whitespace && is_only_whitespace) {
      return false
    }

    return true
  })

  return sanitized_paragraph_content
}

export const get_rich_text = (ops: Op[]) => {
  const rich_text: Rich_Text_Element[] = []

  // paragraph handling
  let current_text_block_content: Rich_Text_Text_Element[] = []

  const submit_heading_if_not_empty = (level: 2 | 3) => {
    if (!is_valid_text_block_content(current_text_block_content)) {
      return
    }

    const content = get_sanitized_paragraph_content(current_text_block_content)

    rich_text.push({ type: 'heading', content, level })
    current_text_block_content = []
  }

  const submit_paragraph_if_not_empty = () => {
    if (!is_valid_text_block_content(current_text_block_content)) {
      return
    }

    const content = get_sanitized_paragraph_content(current_text_block_content)

    rich_text.push({ type: 'paragraph', content })
    current_text_block_content = []
  }

  for (let op_index = 0; op_index < ops.length; op_index++) {
    const op = ops[op_index]

    if (!op.insert) {
      continue
    }

    if (is_string(op)) {
      let formats: Format[] = []
      if (op.attributes) {
        formats = get_formats(op.attributes)
      }

      // remove duplicate line breaks and whitespace
      const sanitized_text = op.insert.replace(/\n+/g, '\n').replace(/[ ]+/g, ' ')
      const paragraph_texts = sanitized_text.split(/\n/)
      const last_paragraph_index = paragraph_texts.length - 1

      for (let paragraph_index = 0; paragraph_index < paragraph_texts.length; paragraph_index++) {
        const text = paragraph_texts[paragraph_index]

        let type: 'subscript' | 'superscript' | 'text' = 'text'
        switch (op.attributes?.script) {
          case 'sub':
            type = 'subscript'

            break

          case 'super':
            type = 'superscript'

            break
        }

        const text_element: Rich_Text_Text_Element = {
          text,
          formats,
          type,
        }

        current_text_block_content.push(text_element)

        const is_last_paragraph = paragraph_index === last_paragraph_index
        const next_op_header = ops[op_index + 1]?.attributes?.header as 2 | 3
        if (is_last_paragraph && next_op_header) {
          submit_heading_if_not_empty(next_op_header)

          continue
        }

        if (paragraph_index !== last_paragraph_index) {
          // complete the current paragraph if is not the last segment
          // if an insert contains line breaks, it'll have been split into 2 or more segments, of which the last will never contain line breaks;
          // the segment completes the paragraph if it isn't the last.
          submit_paragraph_if_not_empty()

          continue
        }
      }

      continue
    }

    // complete the paragraph if the next element isn't text
    submit_paragraph_if_not_empty()

    if (is_image(op)) {
      const url = op.insert.image

      const image: Rich_Text_Image = {
        type: 'image',
        url,
      }

      rich_text.push(image)
      continue
    }

    console.warn(`unhandled op type`, op)

    continue
  }

  // complete the current paragraph if we're at the end and didn't encounter any line breaks
  submit_paragraph_if_not_empty()

  console.debug(ops, rich_text)

  return rich_text
}

export const get_ops = (rich_text: Rich_Text_Element[]): Op[] => {
  return [
    {
      insert: 'tone numbers',
    },
    {
      attributes: {
        header: 2,
      },
      insert: '\n',
    },
    {
      insert: '\nthis text contains ',
    },
    {
      attributes: {
        bold: true,
      },
      insert: 'bold',
    },
    {
      insert: ', ',
    },
    {
      attributes: {
        italic: true,
      },
      insert: 'italic',
    },
    {
      insert: ', and ',
    },
    {
      attributes: {
        script: 'sub',
      },
      insert: 'other',
    },
    {
      insert: ' ',
    },
    {
      attributes: {
        script: 'super',
      },
      insert: 'stuff',
    },
    {
      insert: ' some stuff here\n\nvisualization',
    },
    {
      attributes: {
        header: 3,
      },
      insert: '\n',
    },
    {
      insert: {
        image: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Cantonese_tones.svg',
      },
    },
    {
      insert: '\n',
    },
    {
      attributes: {
        italic: true,
      },
      insert: 'after the image',
    },
    {
      insert: ' is here. ',
    },
    {
      attributes: {
        script: 'super',
      },
      insert: 'nice!',
    },
    {
      insert: '\n',
    },
  ]

  rich_text
  return []
}

type Toolbar_String_Option =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'blockquote'
  | 'code-block'
  | 'link'
  | 'image'
  | 'video'
  | 'formula'
  | 'clean'
type Toolbar_Header_Option = { header: (1 | 2 | 3 | 4 | 5 | 6 | false)[] }
type Toolbar_List_Option = { list: 'ordered' } | { list: 'bullet' } | { list: 'check' }
type Toolbar_Script_Option = { script: 'sub' } | { script: 'super' }
type Toolbar_Indent_Option = { indent: '-1' } | { indent: '+1' }
type Toolbar_Text_Direction_Option = { direction: 'rtl' }
type Toolbar_Size_Option = { size: ('small' | false | 'large' | 'huge')[] }
/** https://quilljs.com/docs/modules/toolbar */
type Toolbar_Option =
  | Toolbar_String_Option
  | Toolbar_Header_Option
  | Toolbar_List_Option
  | Toolbar_Script_Option
  | Toolbar_Indent_Option
  | Toolbar_Text_Direction_Option
  | Toolbar_Size_Option

export const toolbar: Toolbar_Option[] | Toolbar_Option[][] = [
  [{ header: [false, 2, 3] }],
  ['bold', 'italic', { script: 'sub' }, { script: 'super' }, 'blockquote'],
  [{ list: 'bullet' }, { list: 'ordered' }, { list: 'check' }],
  ['image'],
]
