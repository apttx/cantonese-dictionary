import { local_storage_store } from './local_storage_store.mjs'

/** @type {import('svelte/store').Writable<boolean>} */
export const show_jyutping = local_storage_store({ key: 'settings/show_jyutping', value: true })
