import { local_storage_store } from './local_storage_store.js'

export const preferred_ui_alignment = local_storage_store<'left' | 'right'>({
  key: 'settings/preferred_ui_aligment',
  value: 'right',
})
