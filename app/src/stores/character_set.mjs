import { local_storage_store } from './local_storage_store.mjs'

/** @type {import('svelte/store').Writable<'traditional' | 'simplified'>} */
export const character_set = local_storage_store({
  key: 'settings/characters',
  value: 'traditional',
})

/** @type {import('svelte/store').Writable<boolean>} */
export const show_secondary_character_set_if_different = local_storage_store({
  key: 'settings/characters',
  value: true,
})
