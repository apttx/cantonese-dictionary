<script>
  import { fade, fly, scale } from 'svelte/transition'
  import { phrases } from '../../stores/collection.mjs'
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
  <!-- transition error in when user navigated to page or last phrase was deleted -->
  <div
    role="presentation"
    in:fly|global={{ y: 20, duration: 200, easing: cubicOut, delay: 200 }}
    class="empty_info"
  >
    <EmptyCollectionInfo />
  </div>
{:else}
  <!-- transition list out when last phrase was deleted -->
  <ul
    out:fade={{ duration: 200 }}
    class="phrases"
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
    margin-top: 6rem;
    margin-inline: var(--margin_content_text);
  }

  .phrases {
    display: grid;
    grid-template-columns: 1fr;
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
