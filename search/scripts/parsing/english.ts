type Opening_Bracket = '(' | '[' | '{'
type Closing_Bracket = '}' | ']' | ')'

const set_of_opening_brackets = new Set<Opening_Bracket>(['(', '[', '{'])
const set_of_closing_brackets = new Set<Closing_Bracket>(['}', ']', ')'])

const bracket_pair_map = {
  '(': ')',
  ')': '(',
  '[': ']',
  ']': '[',
  '{': '}',
  '}': '{',
} as const

const is_opening_bracket = (string: string): string is Opening_Bracket => {
  return set_of_opening_brackets.has(string as Opening_Bracket)
}

const is_closing_bracket = (string: string): string is Closing_Bracket => {
  return set_of_closing_brackets.has(string as Closing_Bracket)
}

export const get_english_senses = (line: string) => {
  const senses: string[] = []

  let sense_buffer: string[] = []
  let is_english = false
  const bracket_stack: Opening_Bracket[] = []
  for (const current_character of line) {
    if (current_character === '#') {
      break
    }

    if (is_opening_bracket(current_character)) {
      bracket_stack.push(current_character)
    } else if (is_closing_bracket(current_character)) {
      const current_opening_bracket = bracket_stack[bracket_stack.length - 1]
      const required_closing_bracket = bracket_pair_map[current_opening_bracket]

      if (current_character === required_closing_bracket) {
        bracket_stack.pop()
      }
    }

    if (!is_english && !bracket_stack.length && current_character === '/') {
      is_english = true

      continue
    }

    if (!is_english) {
      continue
    }

    if (!bracket_stack.length && current_character === '/') {
      const sense = sense_buffer.join('')

      senses.push(sense)
      sense_buffer = []

      continue
    }

    sense_buffer.push(current_character)
  }

  return senses
}
