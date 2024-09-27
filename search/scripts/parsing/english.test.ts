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

  test('parses gam2 joeng2 correctly', (t) => {
    const fixture =
      "噉樣 啖样 [dan4 yang4] {gam2 joeng2} /(phrase / pronoun) means 'like this'; that way; this way e.g. 佢噉樣唔得 He shouldn't do it like this; in that case; for that reason; since that is the case; then/"
    const expected = [
      "(phrase / pronoun) means 'like this'; that way; this way e.g. 佢噉樣唔得 He shouldn't do it like this; in that case; for that reason; since that is the case; then",
    ]

    const actual = get_english_senses(fixture)

    t.expect(actual).toEqual(expected)
  })
})
