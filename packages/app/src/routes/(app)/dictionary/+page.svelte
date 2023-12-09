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
  <ul class="phrases">
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
    display: grid;
    grid-template-columns: 1fr;
    align-items: stretch;
    gap: 1rem;
    margin-top: 2rem;
    margin-inline: var(--margin_content_layout);
    margin-bottom: 4rem;
  }

  li {
    display: grid;
    align-items: stretch;
  }

  @media (min-width: 30rem) {
    .phrases {
      grid-template-columns: repeat(auto-fit, 20rem);
      justify-content: center;
    }
  }
</style>
