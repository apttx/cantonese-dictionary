<script>
  import Save from '~icons/mingcute/save-2-line'
  import Delete from '~icons/mingcute/delete-2-line'
  import Details from '~icons/mingcute/arrow-right-line'

  import { show_pinyin } from '$stores/show_pinyin.mjs'
  import { show_jyutping } from '$stores/show_jyutping.mjs'
  import { character_set } from '$stores/character_set.mjs'
  import { add, has, remove } from '$stores/collection.mjs'

  /** @type {Phrase} */
  export let phrase
</script>

<div
  role="presentation"
  class="phrase colored_base"
  class:saved={$has(phrase)}
>
  <span class="characters cd_hanzi">
    {phrase[$character_set]}
  </span>

  {#if $show_pinyin}
    <span class="pinyin">
      {phrase.pinyin}
    </span>
  {/if}
  {#if $show_jyutping}
    <span class="jyutping">
      {phrase.jyutping}
    </span>
  {/if}

  <ul class="english">
    {#each phrase.english.split('/') as sense}
      <li>
        {sense}
      </li>
    {/each}
  </ul>

  <a
    href="/dictionary/{phrase.id}"
    title="More information"
    class="detail_link cd_link"
  >
    <Details aria-label="More information" />
  </a>

  {#if $has(phrase)}
    <button
      title="Remove from collection"
      on:click={() => {
        remove(phrase)
      }}
      class="delete_button"
    >
      <Delete aria-label="Remove from collection" />
    </button>
  {:else}
    <button
      title="Save to collection"
      on:click={() => {
        add(phrase)
      }}
      class="save_button"
    >
      <Save aria-label="Save to collection" />
    </button>
  {/if}
</div>

<style>
  .phrase {
    display: grid;
    position: relative;
    align-content: start;
    transition-duration: 150ms;
    transition-property: outline-color;
    transition-timing-function: ease-out;
    outline-color: transparent;
    outline-style: solid;
    outline-width: 0.15rem;
    outline-offset: -0.15rem;
    box-shadow: 0 0.2rem 0.5rem #00000022;
    border-radius: 0.2rem;
    padding: 1rem;
  }

  .saved {
    outline-color: var(--color-red-3);
  }

  .characters {
    margin-bottom: 0.5rem;
  }

  .pinyin,
  .jyutping {
    margin-top: 0.25rem;
  }

  .english {
    margin-top: 0.75rem;
    margin-bottom: 2.5rem;
  }

  .detail_link {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    padding: 1rem;
    text-align: right;
  }

  .save_button,
  .delete_button {
    position: absolute;
    top: 0rem;
    right: 0rem;
    padding: 1rem;
  }
</style>
