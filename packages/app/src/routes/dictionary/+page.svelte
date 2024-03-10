<script>
  import Head from '$components/head.svelte'
  import PhraseListItem from '$components/phrase_list_item.svelte'
  import { cubicOut } from 'svelte/easing'
  import { fade } from 'svelte/transition'

  export let data
</script>

<Head
  title="Dictionary"
  description="Browse the CC-Canto dictionary & save phrases to practice your vocabulary."
/>

{#if data.phrases}
  <ul class="phrases @flashcard_grid +content_margin">
    {#each data.phrases as phrase, index (phrase.id)}
      <li
        in:fade|global={{
          delay: index * 20,
          duration: 200,
          easing: cubicOut,
        }}
      >
        <PhraseListItem {phrase} />
      </li>
    {/each}
  </ul>
{/if}

<style>
  .phrases {
    padding-top: 3rem;
    padding-bottom: 6rem;
  }

  li {
    display: grid;
    align-items: stretch;
  }
</style>
