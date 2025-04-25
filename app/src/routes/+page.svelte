<script lang="ts">
  import { goto } from '$app/navigation'
  import Head from '$components/head.svelte'
  import StoryblokRichTextDocumentNode from '$storyblok/StoryblokRichTextDocumentNode.svelte'
  import SearchForm, { type Submit_Event_Detail } from './search_form.svelte'

  let { data } = $props()

  let loading_state = $state<'idle' | 'pending' | 'error'>('idle')
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

<div
  role="presentation"
  class="content"
>
  <StoryblokRichTextDocumentNode {...data.content} />
</div>

<style>
  .search {
    display: grid;
    justify-items: stretch;
    margin-inline: var(--margin_content_text);
    padding-top: 6rem;
  }

  .content {
    margin-top: 6rem;
    margin-inline: var(--margin_content_text);
  }
</style>
