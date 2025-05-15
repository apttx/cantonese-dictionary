<script lang="ts">
  import { dev } from '$app/environment'
  import type { ClassValue } from 'svelte/elements'
  import type { StoryblokRichTextBlock } from './blocks'
  import { getSeriesTeaser } from './blocks/SeriesTeaser'
  import SeriesTeaser from './blocks/SeriesTeaser.svelte'
  import Container from './blocks/Container.svelte'

  let {
    blocks,
  }: {
    blocks: StoryblokRichTextBlock[]
    class?: ClassValue
  } = $props()
</script>

{#each blocks as block (block)}
  {#if block.component === 'seriesTeaser'}
    {@const seriesTeaser = getSeriesTeaser(block)}
    <SeriesTeaser
      {...seriesTeaser}
      class="seriesTeaser"
    />
  {:else if block.component === 'container'}
    <Container {...block} />
  {:else if dev}
    <details style="margin-block: 3rem;">
      <summary
        class="@button +danger"
        style="text-align: start; cursor: pointer;"
      >
        unhandled block {JSON.stringify(block.component)}
      </summary>

      <pre>{JSON.stringify(block, null, 2)}</pre>
    </details>
  {/if}
{/each}

<style>
  :global(.seriesTeaser) {
    margin-top: 4rem;
    margin-inline: var(--margin_content_text);
  }
</style>
