import { describe, test } from 'vitest'
import { get_english_senses } from './english'

describe('english', () => {
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
