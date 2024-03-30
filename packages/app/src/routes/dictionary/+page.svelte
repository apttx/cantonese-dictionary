<script lang="ts">
  import { fade } from 'svelte/transition'
  import { cubicIn, cubicOut } from 'svelte/easing'

  import PhraseListItem from '$components/phrase_list_item.svelte'
  import Head from '$components/head.svelte'
  import { goto } from '$app/navigation'
  import { has } from '$stores/collection.mjs'
  import Tabs from '$components/tabs.svelte'
  import SearchForm, { type Submit_Event_Detail } from '../search_form.svelte'

  export let data

  let loading_state: 'idle' | 'pending' | 'error' = 'idle'
  const on_submit = async (event: CustomEvent<Submit_Event_Detail>) => {
    const { term, input_element } = event.detail

    if (!term) {
      return
    }

    // blur input while loading to hide mobile keyboards
    input_element.blur()

    loading_state = 'pending'
    try {
      await goto(`?query=${encodeURIComponent(term)}`)

      loading_state = 'idle'
    } catch (error) {
      loading_state = 'error'

      // focus input on errors, user will most likely want to try typing something else
      input_element?.focus()
    }
  }

  $: all_results_tab = {
    title: 'All results',
    count: data.results?.length ?? 0,
  }
  $: results_in_collection = data.results?.filter((phrase) => $has(phrase))
  $: collection_results_tab = {
    title: 'In your collection',
    count: results_in_collection?.length ?? 0,
    disabled: !results_in_collection?.length,
  }
  // TODO: add this as an api feature & use its data
  $: exact_matches = data.results?.filter((phrase) =>
    Object.values(phrase).some((value) => value === data.query),
  )
  $: exact_matches_tab = {
    title: 'Exact matches',
    count: exact_matches?.length ?? 0,
    disabled: !exact_matches?.length,
  }
  $: tabs = [all_results_tab, collection_results_tab, exact_matches_tab]
</script>

<Head
  title="Dictionary"
  description="Search the CC-Canto dictionary & save phrases to practice your vocabulary."
/>

<div
  role="presentation"
  class="search"
>
  <SearchForm
    term={data.query}
    loading={loading_state === 'pending'}
    on:submit={on_submit}
  />

  {#if loading_state === 'pending'}
    <p
      role="status"
      aria-live="polite"
      class="screen_reader_only"
    >
      Loading search results...
    </p>
  {/if}

  {#if loading_state === 'error'}
    <p
      role="alert"
      aria-live="polite"
      class="no_results_text"
    >
      Something went wrong, please try again.
    </p>
  {:else if data.results?.length === 0}
    <p
      role="alert"
      aria-live="polite"
      class="no_results_text"
    >
      Your search didn't yield any results
    </p>
  {/if}
</div>

{#if !data.results}
  <p class="info_text">Search for words, expressions or sayings.</p>
{/if}

<div
  role="presentation"
  class="search_results"
>
  {#if data.results && data.results.length > 0}
    <Tabs
      {tabs}
      let:active
    >
      {@const phrases =
        active === all_results_tab
          ? data.results
          : active === collection_results_tab
            ? results_in_collection
            : active === exact_matches_tab
              ? exact_matches
              : undefined}
      {#if phrases}
        {#key active}
          <h2 class="active_tab_heading @heading +2">{active.title}</h2>

          <ul
            class="@flashcard_grid"
            aria-live="polite"
            aria-busy={loading_state === 'pending'}
            out:fade={{ duration: 200, easing: cubicOut }}
            in:fade={{ duration: 200, delay: 200, easing: cubicIn }}
          >
            {#each phrases as phrase, index (phrase.id)}
              <li
                in:fade|global={{
                  delay: index * 20,
                  duration: 200,
                  easing: cubicIn,
                }}
              >
                <PhraseListItem {phrase} />
              </li>
            {/each}
          </ul>
        {/key}
      {/if}
    </Tabs>
  {/if}
</div>

<style>
  @keyframes loading {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .search {
    display: grid;
    justify-items: stretch;
    margin-inline: var(--margin_content_text);
    padding-top: 6rem;
  }

  .no_results_text {
    margin-top: 4rem;
  }

  .search_results {
    margin-top: 2rem;
    margin-bottom: 4rem;
    margin-inline: var(--margin_content_text);
  }

  @media (min-width: 50rem) {
    .search_results {
      margin-inline: var(--margin_content_page);
    }
  }

  @media (min-width: 66rem) {
    .search_results {
      margin-inline: var(--margin_content_layout);
    }
  }

  li {
    display: grid;
    align-items: stretch;
  }

  .active_tab_heading {
    margin-top: 2rem;
    margin-bottom: 1.5rem;
  }

  .info_text {
    margin-top: 2rem;
    margin-inline: var(--margin_content_text);
  }
</style>
