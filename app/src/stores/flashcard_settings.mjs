import { local_storage_store } from './local_storage_store.mjs'

/** @typedef {{ characters: boolean; romanization: boolean; english: boolean }} Flashcard_Configuration */

/** @type {Flashcard_Configuration} */
const default_flashcard_front_configuration = {
  characters: true,
  romanization: true,
  english: false,
}
export const flashcard_front_configuration = local_storage_store({
  key: 'settings/flashcard_front_configuration',
  value: default_flashcard_front_configuration,
})

/** @type {Flashcard_Configuration} */
const default_flashcard_back_configuration = {
  characters: false,
  romanization: false,
  english: true,
}
export const flashcard_back_configuration = local_storage_store({
  key: 'settings/flashcard_back_configuration',
  value: default_flashcard_back_configuration,
})
