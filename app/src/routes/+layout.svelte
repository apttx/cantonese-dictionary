<script>
  import { setContext } from 'svelte'

  import '../app.mjs'

  import { assets } from '$app/paths'

  import { main_inert } from '$stores/main_inert.mjs'
  import Footer from '$components/footer.svelte'
  import Header from '$components/header.svelte'

  import Settings_Modal from './settings_modal.svelte'
  import Flashcard_Settings_Modal from './flashcard_settings_modal.svelte'
  import Pwa from './pwa.svelte'
  import { chinese_character_font } from '$stores/chinese_character_font'

  /** @type {boolean} */
  let settings_open = false
  /** @type {boolean} */
  let flashcard_settings_open = false

  setContext('open_flashcard_settings', () => {
    flashcard_settings_open = true
  })
</script>

<Pwa />

<svelte:head>
  <link
    rel="icon"
    href="{assets}/favicon.png"
  />
  <link
    rel="icon"
    href="{assets}/favicon.svg"
    type="image/svg+xml"
  />

  {#each [16, 32, 64, 128, 256, 512] as size}
    <link
      rel="icon"
      href="{assets}/favicon_{size}.png"
      sizes="{size}x{size}"
      type="image/png"
    />
  {/each}
</svelte:head>

<Header
  on:toggle_settings={() => {
    settings_open = !settings_open
  }}
/>

<Settings_Modal bind:open={settings_open} />
<Flashcard_Settings_Modal bind:visible={flashcard_settings_open} />

<main
  inert={$main_inert}
  class:cd_hanzi_font_sans={$chinese_character_font === 'sans'}
  class:cd_hanzi_font_serif={$chinese_character_font === 'serif'}
  class:cd_hanzi_font_handwritten={$chinese_character_font === 'handwritten'}
>
  <slot />
</main>

<Footer />

<style>
  main {
    padding-bottom: 6rem;
    min-height: 80vh;
  }

  :global(:root) {
    /* base */
    --bg_base: #ffffff;

    --text_primary_onbase: var(--color-red-3);
    --text_primary-faint_onbase: var(--color-red-1);
    --text_primary-subtle_onbase: var(--color-red-2);
    --text_primary-strong_onbase: var(--color-red-4);

    --text_neutral_onbase: var(--color-neutral-5);
    --text_neutral-faint_onbase: var(--color-neutral-1);
    --text_neutral-subtle_onbase: var(--color-neutral-3);

    --text_brand-3_onbase: var(--color-purple-3);
    --text_brand-3-faint_onbase: var(--color-purple-1);
    --text_brand-3-subtle_onbase: var(--color-purple-2);

    /* primary */
    --bg_primary: var(--color-red-3);
    --text_neutral_onprimary: var(--color-neutral-1);

    --bg_primary-strong: var(--color-red-5);

    /** secondary */
    --bg_brand-3: var(--color-purple-3);

    --margin_screen-borders: 1rem;
    --width_text: 32rem;
    --width_page: 48rem;
    --width_layout: 64rem;

    --margin_content_text: clamp(var(--margin_screen-borders), 100%, 50% - var(--width_text) / 2);
    --margin_content_page: clamp(var(--margin_screen-borders), 100%, 50% - var(--width_page) / 2);
    --margin_content_layout: clamp(
      var(--margin_screen-borders),
      100%,
      50% - var(--width_layout) / 2
    );

    --height_header: 5.25rem;
  }

  :global(.cd_link) {
    transition-duration: 150ms;
    transition-property: color;
    transition-timing-function: ease-in;
    color: var(--text_primary_onbase);
    font-weight: 500;
    text-decoration: underline;
    text-decoration: underline;
    text-decoration-thickness: 0.1em;
    text-underline-offset: 0.25em;
  }
  :global(.cd_link:hover) {
    transition-timing-function: ease-out;
    color: var(--text_primary-strong_onbase);
  }

  :global(.container_text) {
    display: block;
    margin-inline: clamp(var(--margin_screen-borders), 100%, 50% - var(--width_text) / 2);
    width: auto;
    max-width: var(--width_text);
  }

  :global(.container_page) {
    display: block;
    margin-inline: clamp(var(--margin_screen-borders), 100%, 50% - var(--width_page) / 2);
    width: auto;
    max-width: var(--width_page);
  }

  :global(.container_layout) {
    display: block;
    margin-inline: clamp(var(--margin_screen-borders), 100%, 50% - var(--width_layout) / 2);
    width: auto;
    max-width: var(--width_layout);
  }
</style>
