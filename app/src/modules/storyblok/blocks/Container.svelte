<script lang="ts">
  import type { ClassValue } from 'svelte/elements'
  import type { ContainerBlock } from './Container'
  import StoryblokRichTextDocumentNode from '$storyblok/StoryblokRichTextDocumentNode.svelte'

  let {
    content,
    width,
    class: class_,
  }: ContainerBlock & {
    class?: ClassValue
  } = $props()
</script>

<div
  role="presentation"
  class={['container', class_]}
  class:hasTextWidth={width === 'text'}
  class:hasPageWidth={width === 'page'}
  class:hasLayoutWidth={width === 'layout'}
>
  <StoryblokRichTextDocumentNode {...content} />
</div>

<style>
  .container {
    display: grid;
    row-gap: 2rem;
    margin-inline: var(--margin_content_text);
  }

  .hasTextWidth {
    margin-inline: var(--margin_content_text);
  }

  .hasPageWidth {
    margin-inline: var(--margin_content_page);
  }

  .hasLayoutWidth {
    margin-inline: var(--margin_content_layout);
  }
</style>
