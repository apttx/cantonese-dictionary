import { local_storage_store } from './local_storage_store.ts'
import { type Character_Set } from '../../types/Character_Set.ts'

export const character_set = local_storage_store<Character_Set>({
  key: 'settings/characters',
  value: 'traditional',
})

export const show_secondary_character_set_if_different = local_storage_store({
  key: 'settings/characters',
  value: true,
})
