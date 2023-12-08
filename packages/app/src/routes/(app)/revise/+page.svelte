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
  } from '$stores/revise_settings.mjs'

  /** @type {<Type extends unknown = never>(items: Type[]) => Type} */
  const pick_random = (items) => {
    let random_index = Math.floor(Math.random() * items.length)

    const random_item = items[random_index]

    return random_item
  }
  let random_phrase = pick_random($phrases)
  /** @type {boolean} */
  let is_flashcard_flipped = false
  const flip_card = () => {
    is_flashcard_flipped = !is_flashcard_flipped
  }
  const next_phrase = () => {
    is_flashcard_flipped = false
    random_phrase = pick_random($phrases)
  }

  /**
   * @type {(
   *   element: Element,
   *   config: {
   *     delay?: number
   *     duration?: number
   *     easing?: import('svelte/transition').EasingFunction
   *   },
   * ) => {
   *   delay?: number
   *   duration?: number
   *   easing?: import('svelte/transition').EasingFunction
   *   css: (t: number, u: number) => string
   * }}
   */
  const rotate = (_, config) => {
    const { delay, duration, easing } = config
    /** @type {(t: number, u: number) => string} */
    const css = (_, u) => `transform: rotateY(${u * 90}deg)`

    return {
      delay,
      duration,
      easing,
      css,
    }
  }

  const flip_duration = 150

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
  const open_settings = getContext('open_revise_settings')
</script>

<Head
  title="Revise"
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
    class="revise_container"
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
            in:rotate={{ duration: flip_duration, delay: flip_duration, easing: cubicOut }}
            out:rotate={{ duration: flip_duration, easing: cubicIn }}
          >
            <Dynamic_Flashcard_Face
              configuration={$flashcard_back_configuration}
              phrase={random_phrase}
            />
          </div>
        {:else}
          <div
            in:rotate={{ duration: flip_duration, delay: flip_duration, easing: cubicOut }}
            out:rotate={{ duration: flip_duration, easing: cubicIn }}
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
      class="buttons colored_brand-1"
    >
      <button
        title="Settings"
        class="open_settings_button"
        on:click|stopPropagation={open_settings}
      >
        <Cog aria-label="Open settings" />
      </button>
      <button
        title="Flip"
        class="flip_flashcard_button"
        on:click|stopPropagation={flip_card}
      >
        <Flip aria-label="Flip flashcard" />
      </button>
      <button
        title="Next"
        class="next_flashcard_button"
        on:click|stopPropagation={next_phrase}
      >
        <Next aria-label="Next flashcard" />
      </button>
    </div>
  </div>
{/if}

<style>
  .revise_container {
    display: grid;
    grid-template-rows: 1fr auto;
    align-items: start;
    gap: 2rem;
    padding-top: 4rem;
    padding-bottom: 4rem;
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
    grid-template-columns:
      calc(var(--icon_size) + var(--button_inline_padding))
      1fr
      calc(var(--icon_size) + var(--button_inline_padding));
    grid-template-areas: 'settings flip next';
    justify-items: center;
    inset-inline: 0;
    top: calc(100vh - 2.5rem - 2rem);
    top: calc(100dvh - 2.5rem - 2rem);
    margin-inline: auto;
    box-shadow: 0 0.2rem 0.5rem #00000022;
    border-radius: 100vw;
    max-width: 12rem;
  }

  button {
    padding: 0.5rem var(--button_inline_padding);
  }

  .buttons :global(svg) {
    width: var(--icon_size);
    height: var(--icon_size);
  }

  .open_settings_button {
    grid-area: settings;
  }

  .flip_flashcard_button {
    grid-area: flip;
  }

  .next_flashcard_button {
    grid-area: next;
  }

  .empty_info {
    margin-top: 4rem;
    margin-inline: var(--margin_content_text);
  }
</style>
