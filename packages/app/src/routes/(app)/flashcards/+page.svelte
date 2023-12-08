<script>
  import { getContext } from 'svelte'
  import { fly } from 'svelte/transition'
  import { cubicIn, cubicOut } from 'svelte/easing'
  import Flip from '~icons/mingcute/transfer-3-line'
  import Next from '~icons/mingcute/right-line'
  import Cog from '~icons/mingcute/settings-5-line'

  import { phrases } from '$stores/collection.mjs'
  import EmptyCollectionInfo from '$components/empty_collection_info.svelte'
  import Head from '$components/head.svelte'
  import Dynamic_Flashcard_Face from '$components/dynamic_flashcard_face.svelte'
  import {
    flashcard_back_configuration,
    flashcard_front_configuration,
  } from '$stores/flashcard_settings.mjs'

  import { flip } from './transitions.mjs'
  import { get_random } from './utilities.mjs'
  import { preferred_ui_alignment } from '$stores/preferred_ui_alignment.mjs'

  const flip_duration = 150

  let random_phrase = get_random($phrases)
  /** @type {boolean} */
  let is_flashcard_flipped = false
  const flip_card = () => {
    is_flashcard_flipped = !is_flashcard_flipped
  }
  const next_phrase = () => {
    is_flashcard_flipped = false
    random_phrase = get_random($phrases)
  }

  /** @type {Record<number, VoidFunction | undefined>} */
  const screen_click_actions = { 1: flip_card, 2: next_phrase }
  /** @type {(event: MouseEvent) => void} */
  const on_screen_click = (event) => {
    const event_path = event.composedPath()
    // last element in path is always the window
    const window = /** @type {Window} */ (
      event_path.findLast((element) => element instanceof Window)
    )
    const screen_width = window.innerWidth
    const event_position = event.clientX
    // either 0, 1 or 2 depending on where the screen was clicked
    const screen_fraction_index = Math.floor((event_position / screen_width) * 3)
    const action = screen_click_actions[screen_fraction_index]

    if (!action) {
      return
    }

    action()
  }

  /** @type {() => void} */
  const open_settings = getContext('open_flashcard_settings')
</script>

<Head
  title="Flashcards"
  description="Practice the phrases you saved."
/>

{#if !random_phrase}
  <!-- transition error in when user navigated to page or last phrase was deleted -->
  <div
    role="presentation"
    in:fly|global={{ y: 20, duration: 200, easing: cubicOut, delay: flip_duration }}
    class="empty_info"
  >
    <EmptyCollectionInfo />
  </div>
{:else}
  <div
    role="presentation"
    on:click={on_screen_click}
    class="flashcard_container"
  >
    {#key random_phrase.id}
      <div
        role="presentation"
        in:fly={{ y: 20, duration: 200, delay: 200, easing: cubicOut }}
        out:fly={{ y: -20, duration: 200, easing: cubicIn }}
        class="phrase_container"
      >
        {#if is_flashcard_flipped}
          <div
            in:flip={{ duration: flip_duration, delay: flip_duration, easing: cubicOut }}
            out:flip={{ duration: flip_duration, easing: cubicIn }}
          >
            <Dynamic_Flashcard_Face
              configuration={$flashcard_back_configuration}
              phrase={random_phrase}
            />
          </div>
        {:else}
          <div
            in:flip={{ duration: flip_duration, delay: flip_duration, easing: cubicOut }}
            out:flip={{ duration: flip_duration, easing: cubicIn }}
          >
            <Dynamic_Flashcard_Face
              configuration={$flashcard_front_configuration}
              phrase={random_phrase}
            />
          </div>
        {/if}
      </div>
    {/key}

    <div
      role="presentation"
      class="buttons"
      class:aligned_left={$preferred_ui_alignment === 'left'}
      class:aligned_right={$preferred_ui_alignment === 'right'}
    >
      <button
        title="Flip"
        class="action_button"
        on:click|stopPropagation={flip_card}
      >
        <Flip aria-label="Flip flashcard" />
        <span class="action_label">Flip flashcard</span>
      </button>
      <button
        title="Next"
        class="action_button"
        on:click|stopPropagation={next_phrase}
      >
        <Next aria-label="Next flashcard" />
        <span class="action_label">Next flashcard</span>
      </button>
      <button
        title="Settings"
        class="action_button"
        on:click|stopPropagation={open_settings}
      >
        <Cog aria-label="Open flashcard settings" />
        <span class="action_label">Flashcard settings</span>
      </button>
    </div>
  </div>
{/if}

<style>
  .flashcard_container {
    display: grid;
    grid-template-rows: 1fr auto;
    align-items: start;
    gap: 2rem;
    padding-top: 4rem;
    min-height: calc(100vh - var(--height_header));
  }

  .phrase_container {
    display: grid;
    justify-content: center;
  }

  .buttons {
    --icon_size: 1.5rem;
    --button_inline_padding: 1.5rem;

    display: grid;
    position: absolute;
    grid-template-columns: 1fr;
    inset-inline: 0;
    bottom: 2rem;
    margin-inline: auto;
  }
  .buttons.aligned_left {
    justify-items: start;
    margin-left: var(--margin_content_layout);
  }
  .buttons.aligned_right {
    justify-items: end;
    margin-right: var(--margin_content_layout);
  }
  .action_button {
    display: grid;
    gap: 1rem;
    padding-inline: var(--button_inline_padding);
    padding-block: 0.75rem;
    width: max-content;
  }
  .buttons.aligned_left .action_button {
    grid-template-columns: auto 1fr;
    grid-template-areas: 'icon label';
    margin-left: calc(-1 * var(--button_inline_padding));
  }
  .buttons.aligned_right .action_button {
    grid-template-columns: 1fr auto;
    grid-template-areas: 'label icon';
    margin-right: calc(-1 * var(--button_inline_padding));
  }
  .action_button :global(svg) {
    grid-area: icon;
  }
  .action_label {
    grid-area: label;
  }

  .buttons :global(svg) {
    width: var(--icon_size);
    height: var(--icon_size);
  }

  .empty_info {
    margin-top: 4rem;
    margin-inline: var(--margin_content_text);
  }
</style>
