import { browser } from '$app/environment'
import { get, writable } from 'svelte/store'

/**
 * @type {<Type extends any = never>(options: {
 *   key: string
 *   value?: Type
 *   serialize?: (value: Type) => string
 *   deserialize?: (local_storage_item: string) => Type
 * }) => import('svelte/store').Writable<Type>}
 */
export const local_storage_store = (options) => {
  const { key, value } = options

  const serialize = options.serialize ?? JSON.stringify
  const deserialize = options.deserialize ?? JSON.parse

  /** @type {import('svelte/store').Writable<Required<typeof options>['value']>} */
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

  /** @type {import('svelte/store').Writable<Required<typeof options>['value']>['set']} */
  const set = (new_value) => {
    set_store(new_value)

    if (browser) {
      const serialized = serialize(new_value)

      localStorage.setItem(key, serialized)
    }
  }

  /** @type {import('svelte/store').Writable<Required<typeof options>['value']>['update']} */
  const update = (updater) => {
    update_store(updater)

    const new_value = get({ subscribe })

    if (browser) {
      const serialized = serialize(new_value)

      localStorage.setItem(key, serialized)
    }
  }

  /** @type {import('svelte/store').Writable<Required<typeof options>['value']>} */
  const store = {
    subscribe,
    set,
    update,
  }

  return store
}
