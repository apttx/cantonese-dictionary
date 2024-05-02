import { faker } from '@faker-js/faker'

export const get_slug = (string: string) => {
  const slug = string
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/, '')

  return slug
}

export const get_string_color = (string: string): string => {
  const seed =
    string.length > 4
      ? Array.from({ length: string.length })
          .map((_, index) => string.charCodeAt(index))
          .reduce((previous, current) => previous + current, 0)
      : parseInt(
          Array.from({ length: string.length })
            .map((_, index) => string.charCodeAt(index))
            .join(''),
        ) + 3

  faker.seed(seed)
  const [hue, saturation, lightness] = faker.color.hsl()

  const color = `hsl(${hue}, ${((saturation - 0.5) / 2 + 0.5) * 100}%, ${((lightness - 0.5) / 2 + 0.5) * 100}%)`

  return color
}
