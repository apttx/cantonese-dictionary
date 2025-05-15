<script lang="ts">
  import { page } from '$app/state'
  import type { ClassValue } from 'svelte/elements'
  import type { SeriesTeaser } from './SeriesTeaser'

  let {
    series,
    headingTemplate,
    showHeadings = true,
    class: class_,
  }: SeriesTeaser & {
    class?: ClassValue
  } = $props()
  const id = $props.id()

  const headerId = $derived(`${id}Header`)
</script>

<div
  role="presentation"
  class={['container', class_]}
>
  {#each series as seriesItem (seriesItem)}
    {#if seriesItem.pages?.length}
      <nav
        aria-labelledby={showHeadings ? headerId : undefined}
        class="seriesPageNavigation"
      >
        {#if showHeadings}
          <header
            id={headerId}
            class="@heading +2"
          >
            {#if headingTemplate}
              {headingTemplate.replace('{title}', seriesItem.title)}
            {:else}
              {seriesItem.title}
            {/if}
          </header>
        {/if}

        <ol class="seriesPageList">
          {#each seriesItem.pages as pageInSeries}
            {@const isCurrentPage = pageInSeries.route === page.url.pathname}
            <li class="seriesPageItem">
              <a
                href={pageInSeries.route}
                aria-current={isCurrentPage ? 'page' : undefined}
                class="seriesPageLink cd_bordered_button"
                class:isCurrentPage
              >
                {pageInSeries.title}
              </a>
            </li>
          {/each}
        </ol>
      </nav>
    {/if}
  {/each}
</div>

<style>
  .container {
    display: grid;
    row-gap: 2rem;
  }

  .seriesPageList {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
    counter-reset: listItem;
    margin-top: 1.5rem;
  }

  .seriesPageLink {
    display: inline-block;
    counter-increment: listItem;
    padding-block: 0.5rem;
    font-size: 0.875rem;
    text-decoration: none;

    &:before {
      content: counter(listItem) '. ';
    }

    &.isCurrentPage {
      border-color: var(--color-red-3);
      color: var(--color-red-3);
    }
  }
</style>
