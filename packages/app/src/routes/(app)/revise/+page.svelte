<script>
  import { cubicIn, cubicOut } from 'svelte/easing'

  import { character_set } from '$stores/character_set.mjs'
  import { phrases } from '$stores/collection.mjs'
  import { show_jyutping } from '$stores/show_jyutping.mjs'
  import { show_pinyin } from '$stores/show_pinyin.mjs'
  import { revise_direction } from '$stores/revise_direction.mjs'

  import Flip from '~icons/mingcute/transfer-3-line'
  import Next from '~icons/mingcute/right-line'
  import { fly } from 'svelte/transition'
  import EmptyCollectionInfo from '$components/empty_collection_info.svelte'
  import Head from '$components/head.svelte'

  /** @type {<Type extends unknown = never>(items: Type[]) => Type} */
  const pick_random = (items) => {
    let random_index = Math.floor(Math.random() * items.length)

    const random_item = items[random_index]

    return random_item
  }

  let random_phrase = pick_random($phrases)

  /** @type {'chinese' | 'native'} */
  let card_side_visible = $revise_direction === 'chinese_to_native' ? 'chinese' : 'native'

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
    const css = (_, u) => `position: absolute; transform: rotateY(${u * 90}deg)`

    return {
      delay,
      duration,
      easing,
      css,
    }
  }

  const flip_duration = 150
</script>

<Head
  title="Revise"
  description="Practice the phrases you saved."
/>

{#if !random_phrase}
  <div
    role="presentation"
    in:fly={{ y: 20, duration: 200, easing: cubicOut, delay: flip_duration }}
    class="empty_info"
  >
    <EmptyCollectionInfo />
  </div>
{:else}
  <div
    role="presentation"
    class="revise_container"
  >
    {#key random_phrase.id}
      <div
        in:fly={{ y: 20, duration: 200, delay: 200, easing: cubicOut }}
        out:fly={{ y: -20, duration: 200, easing: cubicIn }}
        class="phrase_container"
      >
        {#if card_side_visible === 'native'}
          <div
            class="phrase"
            in:rotate={{ duration: flip_duration, delay: flip_duration, easing: cubicOut }}
            out:rotate={{ duration: flip_duration, easing: cubicIn }}
          >
            <ul class="english">
              {#each random_phrase.english.split('/') as sense}
                <li>
                  {sense}
                </li>
              {/each}
            </ul>
          </div>
        {:else}
          <div
            class="phrase"
            in:rotate={{ duration: flip_duration, delay: flip_duration, easing: cubicOut }}
            out:rotate={{ duration: flip_duration, easing: cubicIn }}
          >
            <span class="characters">{random_phrase[$character_set]}</span>
            {#if $show_pinyin}
              <div>{random_phrase.pinyin}</div>
            {/if}
            {#if $show_jyutping}
              <span>{random_phrase.jyutping}</span>
            {/if}
          </div>
        {/if}
      </div>
    {/key}

    <div
      role="presentation"
      class="buttons"
    >
      <button
        title="Flip"
        class="cd_button flip"
        on:click={() => {
          card_side_visible = card_side_visible === 'chinese' ? 'native' : 'chinese'
        }}
      >
        <Flip aria-label="Flip" />
      </button>
      <button
        title="Next"
        class="cd_button next"
        on:click={() => {
          card_side_visible = $revise_direction === 'chinese_to_native' ? 'chinese' : 'native'
          random_phrase = pick_random($phrases)
        }}
      >
        <Next aria-label="Next" />
      </button>
    </div>
  </div>
{/if}

<style>
  .phrase_container {
    display: grid;
    justify-content: center;
  }

  .phrase {
    display: grid;
    align-content: center;
    margin: auto;
    box-shadow: 0 0.2rem 0.5rem #00000022;
    border-radius: 0.2rem;
    background-color: var(--bg_base);
    padding: 2rem;
    min-width: 16rem;
    min-height: 8rem;
    color: var(--text_neutral_onbase);
    text-align: center;
  }

  .characters {
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
  }

  .buttons {
    --icon_size: 1.5rem;
    --button_inline_padding: 1.5rem;

    display: grid;
    position: sticky;
    grid-template-columns:
      calc(var(--icon_size) + var(--button_inline_padding))
      1fr
      calc(var(--icon_size) + var(--button_inline_padding));
    grid-template-areas: 'previous flip next';
    justify-items: center;
    inset-inline: 0;
    bottom: 2rem;
    margin-inline: auto;
    box-shadow: 0 0.2rem 0.5rem #00000022;
    border-radius: 100vw;
    background-color: var(--bg_primary);
    max-width: 12rem;
    color: var(--text_neutral_onprimary);
  }

  button {
    padding: 0.5rem var(--button_inline_padding);
  }

  .buttons :global(svg) {
    width: var(--icon_size);
    height: var(--icon_size);
  }

  .next {
    grid-area: next;
  }

  .flip {
    grid-area: flip;
  }

  .revise_container {
    display: grid;
    grid-template-rows: 1fr auto;
    align-items: start;
    gap: 2rem;
    padding-top: 4rem;
    padding-bottom: 4rem;
    min-height: calc(100vh - var(--height_header));
  }

  .empty_info {
    margin-top: 4rem;
    margin-inline: var(--margin_content_text);
  }
</style>
