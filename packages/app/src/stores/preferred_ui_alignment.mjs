import { local_storage_store } from './local_storage_store.mjs'

/** @type {import('svelte/store').Writable<'left' | 'right'>} */
export const preferred_ui_alignment = local_storage_store({
  key: 'settings/preferred_ui_aligment',
  value: 'right',
})
