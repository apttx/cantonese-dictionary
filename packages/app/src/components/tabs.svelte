<script lang="ts">
  interface Tab {
    title: string
    count?: number
    disabled?: boolean
  }

  export let tabs: Tab[]
  export let active: Tab = tabs[0]

  $: {
    if (!tabs.includes(active)) {
      const similar_tab = tabs.find((existing_tab) => existing_tab.title === active.title)
      const default_tab = tabs[0]

      active = similar_tab ?? default_tab
    }
  }
</script>

<div
  role="presentation"
  class="tab_navigation"
>
  {#each tabs as tab}
    <button
      class="tab_button"
      class:active={tab === active}
      class:disabled={tab.disabled}
      disabled={tab.disabled}
      on:click={() => {
        active = tab
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
>
  <h2 class="active_heading @heading +2">{active.title}</h2>

  <slot {active} />
</div>

<style>
  .tab_navigation {
    display: grid;
    grid-auto-flow: column;
    place-content: start;
    gap: 1.5rem;
  }

  .tab_count {
    aspect-ratio: 1 / 1;
    font-weight: bold;
  }

  .active_heading {
    margin-top: 2rem;
    margin-bottom: 2rem;
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
</style>