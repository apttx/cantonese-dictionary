<script>
  import { cubicOut } from 'svelte/easing'
  import { fade, fly } from 'svelte/transition'
  import Save from '~icons/mingcute/save-2-line'
  import Remove from '~icons/mingcute/delete-2-line'
  import Collection from '~icons/mingcute/notebook-2-line'

  import Phrase_List_Item from '$components/phrase_list_item.svelte'
  import Head from '$components/head.svelte'
  import { character_set } from '$stores/character_set.mjs'
  import { show_jyutping } from '$stores/show_jyutping.mjs'
  import { show_pinyin } from '$stores/show_pinyin.mjs'
  import { has, add, remove } from '$stores/collection.mjs'

  export let data

  const add_phrase_to_collection = () => {
    add(data.phrase)
  }

  const remove_phrase_from_collection = () => {
    remove(data.phrase)
  }
</script>

<Head
  title="{data.phrase.simplified} &ndash; {data.phrase.english}"
  description="&quot;{data.phrase.simplified}&quot; (or {data.phrase.traditional}) means &quot;{data
    .phrase.english}&quot; and is pronounced &quot;{data.phrase.pinyin}&quot; in Pinyin or {data
    .phrase.jyutping} in Jyutping."
/>

{#key data.phrase.id}
  <div
    role="presentation"
    class="phrase_header"
  >
    <dl class="phrase_details">
      <dt class="characters_title screen_reader_only">
        {$character_set === 'simplified' ? 'Simplified' : 'Traditional'}
      </dt>
      <dd class="characters cd_hanzi">
        {data.phrase[$character_set]}
      </dd>

      {#if $show_pinyin}
        <dt class="pinyin_title screen_reader_only">Pinyin</dt>
        <dd class="pinyin romanization">
          {data.phrase.pinyin}
        </dd>
      {/if}

      {#if $show_jyutping}
        <dt class="jyutping_title screen_reader_only">Jyutping</dt>
        <dd class="jyutping romanization">
          {data.phrase.jyutping}
        </dd>
      {/if}

      <dt class="english_title screen_reader_only">English</dt>
      <dd class="english">
        {data.phrase.english}
      </dd>
    </dl>

    {#if $has(data.phrase)}
      <span
        in:fly|global={{
          y: 16,
          opacity: 0,
          duration: 300,
          easing: cubicOut,
        }}
        out:fly={{
          y: 16,
          opacity: 0,
          duration: 200,
          easing: cubicOut,
        }}
        class="in_collection_tag colored_brand-1"
      >
        <Collection aria-label="Notebook" />
        <span>In your collection</span>
      </span>
    {/if}

    {#if $has(data.phrase)}
      <button
        on:click={remove_phrase_from_collection}
        class="remove_button cd_button"
      >
        <span class="button_text">Remove from collection</span>
        <Remove aria-label="Trash can" />
      </button>
    {:else}
      <button
        on:click={add_phrase_to_collection}
        class="save_button cd_button"
      >
        <span class="button_text">Save to collection</span>
        <Save aria-label="Floppy disk" />
      </button>
    {/if}
  </div>

  {#if data.phrase.senses.length}
    <h2 class="senses_heading">Other meanings</h2>

    <ul class="senses_list">
      {#each data.phrase.senses as sense, index (sense.id)}
        <li
          in:fade|global={{
            delay: index * 30,
            duration: 300,
            easing: cubicOut,
          }}
        >
          <Phrase_List_Item phrase={sense} />
        </li>
      {/each}
    </ul>
  {/if}
{/key}

<style>
  .phrase_header {
    display: grid;
    position: relative;
    grid-template-columns: 1fr auto;
    grid-template-areas:
      'in_collection_tag save_remove_button'
      'phrase_details    phrase_details';
    place-items: start;
    margin-top: 4rem;
  }

  .phrase_details {
    grid-template-columns: 1fr;
    column-gap: 4rem;
    grid-area: phrase_details;
    place-items: start;
    margin-top: 2rem;
    margin-inline: clamp(3rem, 100%, 50% - var(--width_text) / 2);
  }

  .characters_title {
    font-weight: 500;
    font-size: 0.875rem;
  }
  .characters {
    margin-top: 1rem;
    margin-bottom: 2.75rem;
    font-weight: 700;
    font-size: 2.5rem;
    line-height: 1;
  }

  .pinyin {
    margin-top: 0.25rem;
    font-size: 1.25rem;
  }

  .jyutping {
    margin-top: 0.25rem;
    font-size: 1.25rem;
  }

  .english {
    margin-top: 3rem;
    font-size: 1.25rem;
  }

  .in_collection_tag {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-area: in_collection_tag;
    align-items: center;
    gap: 0.5rem;
    margin-left: var(--margin_content_text);
    margin-left: clamp(1rem, 100%, 50vw - var(--width_text) / 2);
    border-radius: 0.2rem;
    padding-right: 0.75rem;
    padding-left: 0.25rem;
    padding-block: 0.25rem;
    line-height: 1;
  }

  .save_button,
  .remove_button {
    display: grid;
    grid-template-columns: auto;
    grid-area: save_remove_button;
    align-items: center;
    justify-self: end;
    gap: 0.5rem;
    margin-block: -0.75rem;
    margin-right: clamp(0.25rem, 100%, 50vw - var(--width_text) / 2 - 1rem);
    padding: 1rem;
    width: max-content;
    line-height: 1;
  }

  .button_text {
    position: fixed;
    visibility: hidden;
    pointer-events: none;
  }

  @media (min-width: 30rem) {
    .button_text {
      position: initial;
      visibility: initial;
      pointer-events: initial;
    }

    .save_button,
    .remove_button {
      grid-template-columns: 1fr auto;
    }
  }

  .senses_heading {
    margin-top: 8.75rem;
    margin-inline: var(--margin_content_text);
    font-weight: 700;
    font-size: 1.25rem;
  }

  .senses_list {
    display: grid;
    grid-template-columns: 1fr;
    align-items: stretch;
    gap: 1rem;
    margin-top: 3rem;
    margin-inline: var(--margin_content_layout);
    margin-bottom: 6rem;
  }
  .senses_list li {
    display: grid;
    align-items: stretch;
  }

  @media (min-width: 30rem) {
    .senses_list {
      grid-template-columns: repeat(auto-fit, 20rem);
      justify-content: center;
    }
  }
</style>
