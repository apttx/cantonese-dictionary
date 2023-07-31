<script>
  import Footer from '$components/footer.svelte'
  import Header from '$components/header.svelte'
  import SettingsModal from '$components/settings_modal.svelte'

  import { main_inert } from '$stores/main_inert.mjs'

  /** @type {boolean} */
  let settings_open = false
</script>

<Header
  on:toggle_settings={() => {
    settings_open = !settings_open
  }}
/>

<SettingsModal bind:open={settings_open} />

<main inert={$main_inert}>
  <slot />
</main>

<Footer />

<style>
  main {
    min-height: 80vh;
  }
</style>
