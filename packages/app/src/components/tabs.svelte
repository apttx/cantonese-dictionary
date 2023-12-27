<script>
  /**
   * @typedef {{
   *   label: string
   *   link: string
   * }} Tab
   */

  /** @type {Tab[]} */
  export let tabs
  /** @type {Tab} */
  export let active_tab = tabs[0]
</script>

<ol class="chapters">
  {#each tabs as tab}
    <li class="tab">
      <a
        href={tab.link}
        class="cd_link tab_link"
        class:colored_brand-1={tab.label === active_tab.label}
      >
        {tab.label}
      </a>
    </li>
  {/each}
</ol>

<slot />

<style>
  .chapters {
    display: flex;
    flex-wrap: wrap;
    margin-top: 1rem;
    margin-inline: var(--margin_content_layout);
  }

  .tab_link {
    display: grid;
    place-content: center;
    border-radius: 0.2rem;
    padding-inline: 0.5rem;
    padding-bottom: 0.25rem;
  }
</style>
