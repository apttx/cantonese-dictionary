<script>
  import { main_inert } from '$stores/main_inert.mjs'
  import { cubicIn, cubicOut } from 'svelte/easing'
  import { fade, scale } from 'svelte/transition'

  import Close from '~icons/mingcute/close-fill'

  /** @type {boolean} */
  export let visible = false
  /** @type {string} */
  export let heading

  $: heading_id = heading.toLocaleLowerCase().replace(/[^a-z]+/gi, '_')

  const in_transition_options = { easing: cubicOut, duration: 300 }
  const out_transition_options = { easing: cubicIn, duration: 200 }

  $: $main_inert = visible
</script>

<svelte:window
  on:keydown={(event) => {
    if (event.key === 'Escape') {
      visible = false
    }
  }}
/>

{#if visible}
  <div
    role="presentation"
    in:fade={in_transition_options}
    out:fade={out_transition_options}
    on:click|self={() => {
      visible = false
    }}
    class="veil"
  >
    <div
      class="container"
      in:scale={in_transition_options}
      out:scale={out_transition_options}
      role="dialog"
      aria-describedby={heading_id}
    >
      <h2
        id={heading_id}
        class="heading"
      >
        {heading}
      </h2>

      <button
        title="Close"
        on:click={() => {
          visible = false
        }}
        class="close_button cd_button"
      >
        <Close aria-label="close" />
      </button>
      <slot />
    </div>
  </div>
{/if}

<style>
  .veil {
    display: grid;
    position: fixed;
    align-content: center;
    justify-content: center;
    z-index: 200;
    inset: 0;
    background-color: #00000022;
    width: 100%;
    height: 100%;
  }

  .container {
    position: relative;
    margin: auto;
    box-shadow: 0 2rem 1.5rem #00000011;
    border-radius: 0.2rem;
    background: var(--bg_base);
    padding: 2rem 2rem 4rem;
    max-height: 100vh;
    max-width: 100vw;
    overflow-y: auto;
    color: var(--text_neutral_onbase);
  }

  .close_button {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
  }

  .heading {
    font-weight: 500;
    font-size: 1.25rem;
  }
</style>
