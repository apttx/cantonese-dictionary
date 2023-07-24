import { local_storage_store } from './local_storage_store.mjs'

/** @type {import('svelte/store').Writable<'chinese_to_native' | 'native_to_chinese'>} */
export const revise_direction = local_storage_store({
  key: 'settings/revise/direction',
  value: 'chinese_to_native',
})
