import { videos } from './videos'
import { get_slug, get_string_color } from './~utilities'
import { Routable_Language } from '../../../../../types/Language'
import { Routable } from '../../../../../types/Routable'
import { cantonese_tones } from './language_aspects/cantonese_tones'
import { cantonese_romanization } from './language_aspects/cantonese_romanization'
import { cantonese_writing } from './language_aspects/cantonese_writing'

const get_language = <Options extends Omit<Routable_Language, keyof Routable | 'color'>>(
  options: Options,
): Routable_Language => {
  const slug = get_slug(options.name)
  const color = get_string_color(options.iso_639_code)

  const language = {
    ...options,
    slug,
    color,
    videos,
  }

  return language
}

export const languages: Routable_Language[] = [
  get_language({
    name: 'Cantonese',
    iso_639_code: 'zh',
    introduction:
      'A dialect of Chinese originating from Guangzhou, spoken by over 80 million people in the Guangdong province, Hong Kong, Macau and other regions of China.',
    aspects: [cantonese_tones, cantonese_romanization, cantonese_writing],
    videos,
  }),
  // get_language({
  //   name: 'Korean',
  //   iso_639_code: 'kr',
  //   introduction: 'The national language of South Korea, spoken by over 80 million people.',
  //   aspects: [korean_writing, korean_pronunciation],
  //   videos: [],
  // }),
  // get_language({
  //   name: 'Japanese',
  //   iso_639_code: 'ja',
  //   introduction: 'The national language of Japan, spoken by over 120 million people.',
  //   aspects: [],
  //   videos: [],
  // }),
  // get_language({
  //   name: 'English',
  //   iso_639_code: 'en',
  //   introduction:
  //     'The national language of England and many other countries, spoken all over the world.',
  //   aspects: [],
  //   videos: [],
  // }),
  // get_language({
  //   name: 'German',
  //   iso_639_code: 'de',
  //   introduction: 'The national language of Germany, Austria, Switzerland and Liechtenstein.',
  //   aspects: [],
  //   videos: [],
  // }),
]
