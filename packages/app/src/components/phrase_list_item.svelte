<script>
  import Save from '~icons/mingcute/save-2-line'
  import Delete from '~icons/mingcute/delete-2-line'

  import { show_pinyin } from '$stores/show_pinyin.mjs'
  import { show_jyutping } from '$stores/show_jyutping.mjs'
  import { character_set } from '$stores/character_set.mjs'
  import { add, has, remove } from '$stores/collection.mjs'

  /** @type {Phrase} */
  export let phrase
</script>

<div
  role="presentation"
  class="phrase"
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

  {#if $has(phrase)}
    <button
      class="delete_button"
      title="Remove from collection"
      on:click={() => {
        remove(phrase)
      }}
    >
      <Delete aria-label="Remove from collection" />
    </button>
  {:else}
    <button
      class="save_button"
      title="Save to collection"
      on:click={() => {
        add(phrase)
      }}
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
    transition-property: border-color;
    transition-timing-function: ease-out;
    box-shadow: 0 0.2rem 0.5rem #00000022;
    border-bottom-width: 0.2rem;
    border-color: transparent;
    border-radius: 0.2rem;
    background-color: var(--bg_base);
    padding: 1rem;
    color: var(--text_neutral_onbase);
  }

  .saved {
    border-color: var(--color-red-3);
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
  }

  .save_button,
  .delete_button {
    position: absolute;
    top: 0rem;
    right: 0rem;
    padding: 1rem;
  }
</style>
