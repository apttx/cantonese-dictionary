import { local_storage_store } from './local_storage_store.mjs'

/** @type {import('svelte/store').Writable<'traditional' | 'simplified'>} */
export const character_set = local_storage_store({
  key: 'settings/characters',
  value: 'traditional',
})
