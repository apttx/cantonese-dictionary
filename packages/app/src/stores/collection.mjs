import { derived, get } from 'svelte/store'
import { local_storage_store } from './local_storage_store.mjs'

/** @type {import('svelte/store').Writable<{ [key in string]: Phrase }>} */
const collection_map = local_storage_store({
  key: 'save_data/collection',
  value: {},
})

/** @typedef {-2 | -1 | 0 | 1 | 2} Rating */

/** @type {import('svelte/store').Writable<Record<Phrase['id'], Rating>>} */
const ratings = local_storage_store({
  key: 'settings/flashcard_ratings',
  value: {},
})

/** @type {(phrase: Phrase) => void} */
export const add = (phrase) => {
  collection_map.set({
    ...get(collection_map),
    [phrase.id]: phrase,
  })
}

/** @type {(phrase: Phrase) => void} */
export const remove = (phrase) => {
  const collection_map_clone = { ...get(collection_map) }
  delete collection_map_clone[phrase.id]
  collection_map.set(collection_map_clone)

  const ratings_clone = { ...get(ratings) }
  delete ratings_clone[phrase.id]
  ratings.set(ratings_clone)
}

/** @type {import('svelte/store').Readable<(phrase: Phrase) => boolean>} */
export const has = derived(
  collection_map,
  (collection_map) => /** @type {(phrase: Phrase) => boolean} */ (phrase) =>
    !!collection_map[phrase.id],
)

/** @type {import('svelte/store').Readable<Phrase[]>} */
export const phrases = derived(collection_map, (collection_map) => Object.values(collection_map))

/** @type {import('svelte/store').Readable<(phrase: Phrase) => Rating>} */
export const get_rating = derived(
  ratings,
  (ratings) => /** @type {(phrase: Phrase) => Rating} */ (phrase) => ratings[phrase.id] ?? 0,
)

export const minimum_rating = -2
/** @param {Phrase} phrase */
export const rate_down = (phrase) => {
  const ratings_clone = { ...get(ratings) }

  const current_rating = ratings_clone[phrase.id] ?? 0
  const new_rating = /** @type {Rating} */ (Math.max(minimum_rating, current_rating - 1))

  ratings_clone[phrase.id] = new_rating

  ratings.set(ratings_clone)
}

export const maximum_rating = 2
/** @param {Phrase} phrase */
export const rate_up = (phrase) => {
  const ratings_clone = { ...get(ratings) }

  const current_rating = ratings_clone[phrase.id] ?? 0
  const new_rating = /** @type {Rating} */ (Math.min(maximum_rating, current_rating + 1))

  ratings_clone[phrase.id] = new_rating

  ratings.set(ratings_clone)
}
