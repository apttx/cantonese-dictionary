<script lang="ts">
  import {
    BlockTypes,
    MarkTypes,
    TextTypes,
    type StoryblokRichTextDocumentNode,
  } from '@storyblok/js'
  import Self from './StoryblokRichTextDocumentNode.svelte'
  import { dev } from '$app/environment'
  import { getMarksMap } from './getMarksMap'
  import StoryblokRichTextBlocks from './StoryblokRichTextBlocks.svelte'
  import type { ClassValue } from 'svelte/elements'

  let {
    content,
    class: class_,
  }: StoryblokRichTextDocumentNode & {
    class?: ClassValue
  } = $props()
</script>

{#if !content}
  <!-- don't render anything if there is no content -->
{:else}
  {#each content as node, index (node)}
    <!-- blocks (heading, paragraph, image, etc.) -->
    {#if node.type === BlockTypes.HEADING}
      {@const tag = `h${node.attrs?.level}`}
      <svelte:element
        this={tag}
        class={['@heading', index === 0 ? class_ : '@withSpacing +betweenGroups']}
        class:+2={node.attrs?.level === 2}
        class:+3={node.attrs?.level === 3}
        class:+4={node.attrs?.level === 4}
        class:+5={node.attrs?.level === 5}
        class:+6={node.attrs?.level === 6}
      >
        <Self {...node} />
      </svelte:element>
    {:else if node.type === BlockTypes.PARAGRAPH}
      <p class={['@text', index === 0 && class_]}>
        <Self {...node} />
      </p>
    {:else if node.type === BlockTypes.QUOTE}
      <blockquote class={['@text', index === 0 && class_]}>
        <Self {...node} />
      </blockquote>
    {:else if node.type === BlockTypes.UL_LIST}
      <ul class={index === 0 ? class_ : undefined}>
        <Self {...node} />
      </ul>
    {:else if node.type === BlockTypes.OL_LIST}
      <ol class={index === 0 ? class_ : undefined}>
        <Self {...node} />
      </ol>
    {:else if node.type === BlockTypes.LIST_ITEM}
      <li class={['@text', index === 0 && class_]}>
        <Self {...node} />
      </li>
    {:else if node.type === BlockTypes.BR}
      <br class={index === 0 ? class_ : undefined} />
      <!-- block content -->
    {:else if node.type === TextTypes.TEXT}
      {@const marksMap = getMarksMap(node.marks)}
      {#if marksMap.isEmpty}
        {node.text}
      {:else if marksMap.href}
        <a
          href={marksMap.href.replace(/\/$/, '')}
          class={[index === 0 && class_]}
          class:bold={marksMap[MarkTypes.BOLD]}
          class:line-through={marksMap[MarkTypes.STRIKE]}
          class:underline={marksMap[MarkTypes.UNDERLINE]}
        >
          {node.text}
        </a>
      {:else}
        <span
          class={index === 0 ? class_ : undefined}
          class:bold={marksMap[MarkTypes.BOLD]}
          class:line-through={marksMap[MarkTypes.STRIKE]}
          class:underline={marksMap[MarkTypes.UNDERLINE]}
        >
          {node.text}
        </span>
      {/if}
    {:else if (node.type = BlockTypes.COMPONENT)}
      {#if Array.isArray(node.attrs?.body)}
        <StoryblokRichTextBlocks
          blocks={node.attrs.body}
          class={index === 0 ? class_ : '@withSpacing +betweenItems'}
        />
      {/if}
    {:else if dev}
      <details style="margin-block: 3rem;">
        <summary
          class="@button +danger"
          style="text-align: start; cursor: pointer;"
        >
          unhandled rich text node {JSON.stringify(node.type)}
        </summary>

        <pre>{JSON.stringify(node, null, 2)}</pre>
      </details>
    {/if}
  {/each}
{/if}

<style>
  .bold {
    font-weight: bold;
  }

  .line-through {
    text-decoration: line-through;
  }

  .underline {
    text-decoration: underline;
  }

  p {
    margin-top: 1rem;

    &:first-child {
      margin-top: 0;
    }
  }

  ul,
  ol {
    margin-block: 2rem;
    padding-left: 1rem;
    list-style-type: disc;

    &:first-child {
      margin-top: 0;
    }
  }

  li > :global(:first-child) {
    margin-top: 0;
  }
</style>
