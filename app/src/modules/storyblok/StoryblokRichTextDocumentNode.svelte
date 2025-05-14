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
  }: Pick<StoryblokRichTextDocumentNode, 'content'> & {
    class?: ClassValue
  } = $props()
</script>

{#if !content}
  <!-- don't render anything if there is no content -->
{:else}
  {#each content as node (node)}
    <!-- blocks (heading, paragraph, image, etc.) -->
    {#if node.type === BlockTypes.HEADING}
      {@const tag = `h${node.attrs?.level}`}
      <svelte:element
        this={tag}
        class="richText @heading"
        class:+2={node.attrs?.level === 2}
        class:+3={node.attrs?.level === 3}
        class:+4={node.attrs?.level === 4}
        class:+5={node.attrs?.level === 5}
        class:+6={node.attrs?.level === 6}
      >
        <Self {...node} />
      </svelte:element>
    {:else if node.type === BlockTypes.PARAGRAPH}
      <p class="richText">
        <Self {...node} />
      </p>
    {:else if node.type === BlockTypes.QUOTE}
      <blockquote class="richText">
        <Self {...node} />
      </blockquote>
    {:else if node.type === BlockTypes.UL_LIST}
      <ul class="richText">
        <Self {...node} />
      </ul>
    {:else if node.type === BlockTypes.OL_LIST}
      <ol class="richText">
        <Self {...node} />
      </ol>
    {:else if node.type === BlockTypes.LIST_ITEM}
      <li class="richText">
        <Self {...node} />
      </li>
    {:else if node.type === BlockTypes.BR}
      <br class="richText" />
    {:else if node.type === BlockTypes.TABLE}
      {#if node.content?.length}
        {@const headerRows = node.content.filter((row) => {
          if (!row.content) {
            return false
          }

          return row.content[0].type === BlockTypes.TABLE_HEADER
        })}
        {@const bodyRows = node.content.filter((row) => {
          if (!row.content) {
            return false
          }

          return row.content[0].type === BlockTypes.TABLE_CELL
        })}

        {#if headerRows.length && bodyRows.length}
          <table class="richText">
            <thead>
              {#each headerRows as headerRow}
                {#if headerRow.content?.length}
                  <tr>
                    {#each headerRow.content as tableHeader}
                      <th>
                        <Self {...tableHeader} />
                      </th>
                    {/each}
                  </tr>
                {/if}
              {/each}
            </thead>
            <tbody>
              {#each bodyRows as bodyRow}
                {#if bodyRow.content?.length}
                  <tr>
                    {#each bodyRow.content as tableCell}
                      <td>
                        <Self {...tableCell} />
                      </td>
                    {/each}
                  </tr>
                {/if}
              {/each}
            </tbody>
          </table>
        {/if}
      {/if}
    {:else if node.type === TextTypes.TEXT}
      {@const marksMap = getMarksMap(node.marks)}
      {#if marksMap.isEmpty}
        {node.text}
      {:else if marksMap.href}
        <a
          href={marksMap.href.replace(/\/$/, '')}
          class:bold={marksMap[MarkTypes.BOLD]}
          class:line-through={marksMap[MarkTypes.STRIKE]}
          class:underline={marksMap[MarkTypes.UNDERLINE]}
        >
          {node.text}
        </a>
      {:else}
        <span
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
          class="richText"
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
  .richText:not(.richText .richText) {
    margin-inline: var(--margin_content_text);
  }

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

  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 4rem;

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

    &:last-child {
      margin-bottom: 0;
    }
  }

  li > :global(:first-child) {
    margin-top: 0;
  }

  table {
    margin-block: 1rem;
    border-collapse: collapse;
    overflow-x: auto;
  }

  tr {
    border-bottom-width: 0.15rem;
    border-bottom-color: var(--color-red-1);

    @media (prefers-contrast: more) {
      & {
        border-bottom-color: var(--color-red-3);
      }
    }
  }

  th,
  td {
    padding-inline: 0.5rem;
    padding-block: 0.25rem;
  }

  thead tr:first-child th {
    padding-top: 0;
  }

  th {
    text-align: start;

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      padding-right: 0;
    }
  }
</style>
