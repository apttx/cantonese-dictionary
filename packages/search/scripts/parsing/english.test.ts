import { describe, test } from 'vitest'
import { get_english_senses } from './english'

const fixture =
  '一 一 [yi1] {jat1} /one/single/a (article)/as soon as/entire/whole/all/throughout/"one" radical in Chinese characters (Kangxi radical 1)/also pr. [yāo] for greater clarity when spelling out numbers digit by digit/first (positional)/one part of a fraction, such as \'a\' quarter, an eighth/a short duration (when used with a verb)/each/same/dedicated/from the start/ # adapted from cc-cedict'

describe('english', (t) => {
  test('parses single sense', (t) => {
    const fixture = '一 一 [yi1] {jat1} /one/'
    const expected = ['one']

    const actual = get_english_senses(fixture)

    t.expect(actual).toEqual(expected)
  })

  test('parses multiple senses', (t) => {
    const fixture = '一 一 [yi1] {jat1} /one/single/a (article)/'
    const expected = ['one', 'single', 'a (article)']

    const actual = get_english_senses(fixture)

    t.expect(actual).toEqual(expected)
  })

  test('parses single sense in brackets as single sense', (t) => {
    const fixture = '一 一 [yi1] {jat1} /(one/single/a)/'
    const expected = ['(one/single/a)']

    const actual = get_english_senses(fixture)

    t.expect(actual).toEqual(expected)
  })

  test('parses nested brackets', (t) => {
    const fixture = '一 一 [yi1] {jat1} /(one/single/a (article))/'
    const expected = ['(one/single/a (article))']

    const actual = get_english_senses(fixture)

    t.expect(actual).toEqual(expected)
  })

  test('ignores everything after the last slash', (t) => {
    const fixture = '一 一 [yi1] {jat1} /one/ some text here'
    const expected = ['one']

    const actual = get_english_senses(fixture)

    t.expect(actual).toEqual(expected)
  })

  test('ignores comments', (t) => {
    const fixture = '一 一 [yi1] {jat1} /one/ # some comment/text here'
    const expected = ['one']

    const actual = get_english_senses(fixture)

    t.expect(actual).toEqual(expected)
  })
})
