<script lang="ts">
  import Tabs, { type Tab } from '$components/tabs.svelte'
  import Stroke_Order from './Stroke_Order.svelte'
  import { character_set } from '$stores/character_set.mjs'
  import type { Phrase } from '$types/Phrase'

  let { simplified, traditional }: Pick<Phrase, 'simplified' | 'traditional'> = $props()

  interface Characters_Tab extends Tab {
    characters: string[]
  }

  const unsorted_tabs: [Characters_Tab, ...Characters_Tab[]] = [
    {
      title: 'Simplified',
      characters: Array.from(simplified),
    },
    {
      title: 'Traditional',
      characters: Array.from(traditional),
    },
  ]
  const tabs = $derived(
    ($character_set === 'traditional' ? unsorted_tabs.toReversed() : unsorted_tabs) as [
      Characters_Tab,
      ...Characters_Tab[],
    ],
  )
</script>

{#if simplified !== traditional}
  <Tabs {tabs}>
    {#snippet children(snippet_props)}
      {@const active_tab = snippet_props.active_tab as unknown as { characters: string[] }}
      {#if active_tab.characters}
        <div
          role="presentation"
          class="tab_content_container"
        >
          <Stroke_Order characters={active_tab.characters} />
        </div>
      {/if}
    {/snippet}
  </Tabs>
{:else}
  <Stroke_Order characters={Array.from(simplified)} />
{/if}

<style>
  .tab_content_container {
    margin-top: 2rem;
  }
</style>
