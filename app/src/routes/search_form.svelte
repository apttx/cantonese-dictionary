<script
  lang="ts"
  context="module"
>
  export interface Submit_Event_Detail {
    term: string
    input_element: {
      blur: () => void
      focus: () => void
    }
  }
</script>

<script lang="ts">
  import Loading from '~icons/mingcute/loading-fill'
  import Search from '~icons/mingcute/search-2-line'

  import { createEventDispatcher } from 'svelte'

  export let term: string | null = null
  export let loading: boolean = false
  let search_input_element: HTMLInputElement

  const dispatch = createEventDispatcher<{
    submit: Submit_Event_Detail
  }>()
  const on_submit = () => {
    if (!term) {
      return
    }

    const blur = () => search_input_element?.blur()
    const focus = () => search_input_element?.focus()
    const input_element = { blur, focus }

    dispatch('submit', { term, input_element })
  }
</script>

<form
  inert={loading}
  class="search_form"
  on:submit|preventDefault={on_submit}
>
  <label class="search_label">
    <span class="search_label_text">Search the dictionary</span>

    <input
      bind:this={search_input_element}
      type="search"
      placeholder="中國, 中国, English, jyut6 ping3, pin1 yin1"
      bind:value={term}
      class="search_input cd_input"
    />
  </label>

  <button
    type="submit"
    class="search_submit_button cd_bordered_button"
    disabled={loading}
  >
    <span
      aria-hidden="true"
      class="loading_icon"
      class:active={loading}
    >
      <Loading />
    </span>

    <span
      class="search_icon"
      class:hidden={loading}
    >
      <Search aria-label="Submit search" />
    </span>
  </button>
</form>

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
</style>
