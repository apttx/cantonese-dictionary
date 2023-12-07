<script>
  import { fade } from 'svelte/transition'
  import { cubicOut } from 'svelte/easing'

  import Loading from '~icons/mingcute/loading-fill'
  import Search from '~icons/mingcute/search-2-line'

  import { gql, client } from '../../graphql.mjs'

  import PhraseListItem from '$components/phrase_list_item.svelte'
  import Head from '$components/head.svelte'

  /** @type {string} */
  let search_input_string
  /** @type {HTMLInputElement} */
  let search_input_element
  /** @type {null | any[]} */
  let results = null

  const search_query = gql`
    query search($query: String!) {
      search(query: $query, limit: 50) {
        id
        english
        traditional
        simplified
        jyutping
        pinyin
      }
    }
  `

  /** @type {import('./$types').Snapshot<{ search_input: string; results: null | any[] }>} */
  export const snapshot = {
    capture: () => {
      const snapshot = { search_input: search_input_string, results }

      return snapshot
    },
    restore: (snapshot) => {
      if (snapshot) {
        search_input_string = snapshot.search_input
        results = snapshot.results
      }
    },
  }

  /** @type {'idle' | 'pending' | 'error'} */
  let loading_state = 'idle'

  /** @type {(query: string) => Promise<any[]>} */
  const search = async () => {
    /** @type {import('@urql/core').OperationResult<{ search: any[] }>} */
    const result = await client.query(search_query, { query: search_input_string })

    const phrases = result.data?.search.map((phrase) => phrase) ?? []

    return phrases
  }

  // present emtpy search nicely
  $: center_search_form = results === null

  const on_submit = async () => {
    // blur input while loading to hide mobile keyboards
    search_input_element?.blur()

    try {
      loading_state = 'pending'
      const phrases = await search(search_input_string)

      results = phrases

      loading_state = 'idle'
    } catch (error) {
      console.error('unable to load:', error)
      loading_state = 'error'

      // focus input on errors, user will most likely want to try typing something else
      search_input_element?.focus()
    }
  }
</script>

<Head
  title="Search"
  description="Search the CC-Canto dictionary & save phrases to practice your vocabulary."
/>

<div
  role="presentation"
  class="search"
  class:centered={center_search_form}
>
  <form
    inert={loading_state === 'pending'}
    class="search_form"
    on:submit|preventDefault={on_submit}
  >
    <label class="search_label">
      <span class="search_label_text">Search the dictionary</span>

      <input
        bind:this={search_input_element}
        type="search"
        placeholder="中國, 中国, English, jyut6 ping3, pin1 yin1"
        bind:value={search_input_string}
        class="search_input cd_input"
      />
    </label>

    <button
      type="submit"
      class="search_submit_button cd_bordered_button"
      disabled={loading_state === 'pending'}
    >
      <span
        aria-hidden="true"
        class="loading_icon"
        class:active={loading_state === 'pending'}
      >
        <Loading />
      </span>

      <span
        class="search_icon"
        class:hidden={loading_state === 'pending'}
      >
        <Search aria-label="Submit search" />
      </span>
    </button>
  </form>

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
  {:else if results?.length === 0}
    <p
      role="alert"
      aria-live="polite"
      class="no_results_text"
    >
      Your search didn't yield any results
    </p>
  {/if}
</div>

{#if results}
  <ul
    class="search_results"
    aria-live="polite"
    aria-busy={loading_state === 'pending'}
  >
    {#each results as phrase, index (phrase.id)}
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
{:else}
  <h2 class="about_heading">About</h2>
  <p class="about_text">
    This dictionary is a passion project to help with learning Cantonese. It's built for English
    speakers and is best used to supplement other resources, such as subtitled videos or free video
    lessons.
  </p>
{/if}

<style>
  @keyframes loading {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  label {
    justify-items: stretch;
  }

  .search {
    display: grid;
    justify-items: stretch;
    margin-top: 4rem;
    margin-inline: var(--margin_content_text);
  }

  .search_form {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: end;
    justify-items: stretch;
    gap: 0.5rem;
  }

  .search_label {
    display: grid;
  }

  .search_label_text {
    font-weight: 500;
  }

  .search_input {
    display: block;
    margin-top: 0.5rem;
    width: 100%;
    min-width: 0px;
    max-width: 100%;
  }

  .search_submit_button {
    display: grid;
    position: relative;
    align-content: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
  }

  .search_icon {
    transition-duration: 150ms;
    transition-property: opacity;
    transition-timing-function: ease-out;
  }

  .search_icon.hidden {
    opacity: 0;
  }

  .loading_icon {
    display: grid;
    position: absolute;
    align-content: center;
    justify-content: center;
    opacity: 0;
    animation-duration: 1s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-fill-mode: backwards;
    animation-play-state: paused;
    animation-name: loading;
    transition-duration: 100ms;
    transition-property: opacity;
    transition-timing-function: ease-in;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    color: var(--context_color_hint);
  }

  .loading_icon.active {
    opacity: 1;
    animation-play-state: running;
    transition-timing-function: ease-out;
  }

  .loading_icon :global(svg) {
    width: 100%;
    height: 100%;
  }

  .no_results_text {
    margin-top: 2rem;
  }

  .search_results {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-top: 2rem;
    margin-bottom: 4rem;
    margin-inline: var(--margin_content_layout);
  }

  @media (min-width: 30rem) {
    .search_results {
      grid-template-columns: repeat(auto-fit, 20rem);
      justify-content: center;
    }
  }

  .about_heading {
    margin-top: 4rem;
    margin-inline: var(--margin_content_text);
    font-weight: bold;
    font-size: 1.25rem;
  }
  .about_text {
    margin-top: 0.5rem;
    margin-inline: var(--margin_content_text);
  }
</style>
