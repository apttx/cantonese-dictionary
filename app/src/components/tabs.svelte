<script
  lang="ts"
  module
>
  export interface Tab {
    title: string
    count?: number
    disabled?: boolean
  }
</script>

<script
  lang="ts"
  generics="Tab_Instance extends Tab"
>
  import { untrack, type Snippet } from 'svelte'

  let {
    tabs,
    children,
  }: {
    // eslint-svelte doesn't understand generics
    // eslint-disable-next-line no-undef
    tabs: [Tab_Instance, ...Tab_Instance[]]
    // eslint-disable-next-line no-undef
    children?: Snippet<[{ active_tab: Tab_Instance }]>
  } = $props()

  let active_tab = $state.raw(tabs[0])

  // update the active tab to the new tabs if the tabs prop changes
  $effect(() => {
    untrack(() => active_tab)

    const similar_tab = tabs.find((existing_tab) => existing_tab.title === active_tab.title)

    active_tab = similar_tab ?? tabs[0]
  })
</script>

<div
  role="presentation"
  class="tab_navigation"
>
  {#each tabs as tab}
    <button
      class="tab_button"
      class:active={tab === active_tab}
      class:disabled={tab.disabled}
      disabled={tab.disabled}
      onclick={() => {
        active_tab = tab
      }}
    >
      <span>{tab.title}</span>

      {#if tab.count !== undefined}
        <span class="tab_count colored_base_brand-1">&nbsp;{tab.count}</span>
      {/if}
    </button>
  {/each}
</div>

<div
  role="presentation"
  aria-live="assertive"
  class="content_container"
>
  {#if children}
    {@render children({ active_tab })}
  {/if}
</div>

<style>
  .tab_navigation {
    display: grid;
    position: relative;
    top: -1rem;
    grid-auto-flow: column;
    place-content: start;
    overflow: auto hidden;
  }

  .tab_count {
    aspect-ratio: 1 / 1;
    font-weight: bold;
  }

  .tab_button {
    position: relative;
    left: -0.75rem;
    padding-inline: 0.75rem;
    padding-block: 1rem;
    width: max-content;
  }

  .tab_button.active {
    --underline_thickness: 0.15rem;

    text-decoration: underline;
    text-decoration-color: var(--color-red-3);
    text-decoration-thickness: var(--underline_thickness);
    text-underline-offset: 0.4rem;
  }

  .tab_button.disabled {
    opacity: 0.5;

    @media (prefers-contrast: more) {
      opacity: 1;
      text-decoration: line-through;
    }
  }

  .content_container {
    margin-top: -1rem;
  }
</style>
