import { derived, get } from 'svelte/store'
import { local_storage_store } from './local_storage_store.js'
import type { Phrase } from '$types/Phrase.js'

const collection_map = local_storage_store<{ [key in string]: Phrase }>({
  key: 'save_data/collection',
  value: {},
})

export const add = (phrase: Phrase) => {
  collection_map.set({
    ...get(collection_map),
    [phrase.id]: phrase,
  })
}

export const remove = (phrase: Phrase) => {
  const collection_map_clone = { ...get(collection_map) }
  delete collection_map_clone[phrase.id]

  collection_map.set(collection_map_clone)
}

export const has = derived(
  collection_map,
  (collection_map) => (phrase: Phrase) => !!collection_map[phrase.id],
)

export const phrases = derived(collection_map, (collection_map) => Object.values(collection_map))
