<script>
  import Footer from '$components/footer.svelte'
  import Header from '$components/header.svelte'
  import SettingsModal from '$components/settings_modal.svelte'

  import { main_inert } from '$stores/main_inert.mjs'
  import { setContext } from 'svelte'
  import Revise_Settings_Modal from './revise_settings_modal.svelte'

  /** @type {boolean} */
  let settings_open = false
  /** @type {boolean} */
  let revise_settings_open = false

  setContext('open_revise_settings', () => {
    revise_settings_open = true
  })
</script>

<Header
  on:toggle_settings={() => {
    settings_open = !settings_open
  }}
/>

<SettingsModal bind:open={settings_open} />
<Revise_Settings_Modal bind:visible={revise_settings_open} />

<main inert={$main_inert}>
  <slot />
</main>

<Footer />

<style>
  main {
    min-height: 80vh;
  }
</style>
