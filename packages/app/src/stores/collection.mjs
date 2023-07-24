import { derived, get } from 'svelte/store'
import { local_storage_store } from './local_storage_store.mjs'

/** @type {import('svelte/store').Writable<{ [key in string]: Phrase }>} */
const collection_map = local_storage_store({
  key: 'save_data/collection',
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
}

/** @type {import('svelte/store').Readable<(phrase: Phrase) => boolean>} */
export const has = derived(
  collection_map,
  (collection_map) => /** @type {(phrase: Phrase) => boolean} */ (phrase) =>
    !!collection_map[phrase.id],
)

/** @type {import('svelte/store').Readable<Phrase[]>} */
export const phrases = derived(collection_map, (collection_map) => Object.values(collection_map))
