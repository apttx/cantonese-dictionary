import { local_storage_store } from './local_storage_store.mjs'

export const chinese_character_font = local_storage_store<'sans' | 'serif' | 'handwritten'>({
  key: 'settings/chinese_characters_font',
  value: 'sans',
})
