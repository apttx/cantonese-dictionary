import { local_storage_store } from './local_storage_store.js'

export interface Flashcard_Configuration {
  characters: boolean
  romanization: boolean
  english: boolean
}

const default_flashcard_front_configuration: Flashcard_Configuration = {
  characters: true,
  romanization: true,
  english: false,
}
export const flashcard_front_configuration = local_storage_store({
  key: 'settings/flashcard_front_configuration',
  value: default_flashcard_front_configuration,
})

const default_flashcard_back_configuration: Flashcard_Configuration = {
  characters: false,
  romanization: false,
  english: true,
}
export const flashcard_back_configuration = local_storage_store({
  key: 'settings/flashcard_back_configuration',
  value: default_flashcard_back_configuration,
})
