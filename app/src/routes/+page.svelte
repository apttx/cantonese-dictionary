<script lang="ts">
  import { goto } from '$app/navigation'
  import Head from '$components/head.svelte'
  import SearchForm, { type Submit_Event_Detail } from './search_form.svelte'

  let loading_state: 'idle' | 'pending' | 'error' = 'idle'
  const on_submit = async (event: CustomEvent<Submit_Event_Detail>) => {
    const { term, input_element } = event.detail

    if (!term) {
      return
    }

    input_element.blur()

    loading_state = 'pending'
    await goto(`?query=${encodeURIComponent(term)}`)
  }
</script>

<Head
  title="About"
  description="Search the CC-Canto dictionary & save phrases to practice your vocabulary."
/>

<div
  role="presentation"
  class="search"
>
  <SearchForm
    term={undefined}
    loading={loading_state === 'pending'}
    on:submit={on_submit}
  />
</div>

<h2 class="about_heading">About</h2>

<p class="about_text">
  This dictionary is a passion project to help with learning Cantonese. It's built for English
  speakers and is best used to supplement other resources, such as subtitled videos or free video
  lessons.
</p>

<style>
  .search {
    display: grid;
    justify-items: stretch;
    margin-inline: var(--margin_content_text);
    padding-top: 6rem;
  }

  .about_heading {
    margin-top: 6rem;
    margin-inline: var(--margin_content_text);
    font-weight: bold;
    font-size: 1.25rem;
  }

  .about_text {
    margin-top: 0.5rem;
    margin-inline: var(--margin_content_text);
  }
</style>
