import { browser } from '$app/environment'
import { get, writable, type Writable } from 'svelte/store'

export const local_storage_store = <Type = never>(options: {
  key: string
  value?: Type
  serialize?: (value: Type) => string
  deserialize?: (local_storage_item: string) => Type
}) => {
  const { key, value } = options

  const serialize = options.serialize ?? JSON.stringify
  const deserialize = options.deserialize ?? JSON.parse

  const {
    subscribe,
    set: set_store,
    update: update_store,
  } = writable(value, () => {
    if (browser) {
      const stored_item = localStorage.getItem(key)
      if (stored_item) {
        const deserialized = deserialize(stored_item)

        set_store(deserialized)
      }
    }
  })

  const set: Writable<Type>['set'] = (new_value) => {
    set_store(new_value)

    if (browser) {
      const serialized = serialize(new_value)

      localStorage.setItem(key, serialized)
    }
  }

  const update: Writable<Type>['update'] = (updater) => {
    update_store(updater)

    const new_value = get({ subscribe })

    if (browser) {
      const serialized = serialize(new_value)

      localStorage.setItem(key, serialized)
    }
  }

  const store: Writable<Type> = {
    subscribe,
    set,
    update,
  }

  return store
}
