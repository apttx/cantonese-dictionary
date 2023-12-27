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

<nav class="language_links">
  <ul>
    <li>
      <a
        href="/dictionary/english"
        class="cd_link"
      >
        English
      </a>
    </li>
  </ul>
</nav>

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
  .language_links {
    margin-inline: var(--margin_content_layout);
    margin-top: 3rem;
  }

  .phrases {
    display: grid;
    grid-template-columns: 1fr;
    align-items: stretch;
    gap: 1rem;
    margin-inline: var(--margin_content_layout);
    padding-top: 3rem;
    padding-bottom: 6rem;
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
