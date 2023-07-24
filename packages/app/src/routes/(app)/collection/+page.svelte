<script>
  import { fade, fly, scale } from 'svelte/transition'
  import { phrases } from '../../../stores/collection.mjs'
  import PhraseListItem from '$components/phrase_list_item.svelte'
  import { cubicIn, cubicOut } from 'svelte/easing'
  import EmptyCollectionInfo from '$components/empty_collection_info.svelte'
  import Head from '$components/head.svelte'
</script>

<Head
  title="Collection"
  description="Browse your collection of chinese phrases."
/>

{#if !$phrases?.length}
  <div
    role="presentation"
    in:fly={{ y: 20, duration: 200, easing: cubicOut, delay: 200 }}
    class="empty_info"
  >
    <EmptyCollectionInfo />
  </div>
{:else}
  <ul
    out:fade={{ duration: 200 }}
    class="search_results"
  >
    {#each $phrases as phrase, index (phrase.id)}
      <li
        in:fade|global={{ delay: index * 20, duration: 200, easing: cubicOut }}
        out:scale={{ duration: 300, easing: cubicIn }}
      >
        <PhraseListItem {phrase} />
      </li>
    {/each}
  </ul>
{/if}

<style>
  .empty_info {
    margin-top: 4rem;
    margin-inline: var(--margin_content_text);
  }

  .search_results {
    display: grid;
    grid-template-columns: repeat(auto-fit, 18rem);
    justify-content: center;
    gap: 1rem;
    margin: 2rem auto 4rem;
    max-width: calc(70rem - 2rem);
  }
</style>
