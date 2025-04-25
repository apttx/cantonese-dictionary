<script lang="ts">
  import { dev } from '$app/environment'
  import type { ClassValue } from 'svelte/elements'
  import type { StoryblokRichTextBlock } from './blocks'

  let {
    blocks,
  }: {
    blocks: StoryblokRichTextBlock[]
    class?: ClassValue
  } = $props()
</script>

{#each blocks as block (block)}
  {#if block.component === '_'}{:else if dev}
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
