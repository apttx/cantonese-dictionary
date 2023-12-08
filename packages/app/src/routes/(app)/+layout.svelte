<script>
  import { setContext } from 'svelte'
  import { main_inert } from '$stores/main_inert.mjs'
  import Footer from '$components/footer.svelte'
  import Header from '$components/header.svelte'

  import Settings_Modal from './settings_modal.svelte'
  import Flashcard_Settings_Modal from './flashcard_settings_modal.svelte'

  /** @type {boolean} */
  let settings_open = false
  /** @type {boolean} */
  let flashcard_settings_open = false

  setContext('open_flashcard_settings', () => {
    flashcard_settings_open = true
  })
</script>

<Header
  on:toggle_settings={() => {
    settings_open = !settings_open
  }}
/>

<Settings_Modal bind:open={settings_open} />
<Flashcard_Settings_Modal bind:visible={flashcard_settings_open} />

<main inert={$main_inert}>
  <slot />
</main>

<Footer />

<style>
  main {
    min-height: 80vh;
  }
</style>
