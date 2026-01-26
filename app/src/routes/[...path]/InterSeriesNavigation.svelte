<script
  lang="ts"
  module
>
  export const getInterSeriesNavigationPages = (
    page: Page,
  ):
    | {
        series: Series
        previousPage?: Page
        nextPage?: Page
      }
    | undefined => {
    const series = page.series[0]
    if (!series?.pages.length) {
      return
    }

    const indexInSeries = series.pages.findIndex((pageInSeries) => {
      return pageInSeries.id === page.id
    })
    const previousPage = series.pages[indexInSeries - 1]
    const nextPage = series.pages[indexInSeries + 1]

    if (!previousPage && !nextPage) {
      return
    }

    return {
      series,
      previousPage,
      nextPage,
    }
  }
</script>

<script lang="ts">
  import { resolve } from '$app/paths'

  import type { Page } from '$storyblok/stories/Page'
  import type { Series } from '$storyblok/stories/Series'
  import type { ClassValue } from 'svelte/elements'
  import Previous from '~icons/mingcute/arrow-left-line'
  import Next from '~icons/mingcute/arrow-right-line'

  let {
    series,
    previousPage,
    nextPage,
    class: class_,
  }: {
    series: Series
    previousPage?: Page
    nextPage?: Page
    class?: ClassValue
  } = $props()
</script>

<nav class={['navigation', class_]}>
  {#if previousPage}
    <a
      href={resolve('/[...path]', {
        path: previousPage.route,
      })}
      class="previousLink link"
    >
      <span class="prefix">
        Previous in {series.title}:
      </span>

      <span class="title">
        <Previous aria-hidden="true" />
        {previousPage.title}
      </span>
    </a>
  {/if}

  {#if nextPage}
    <a
      href={resolve('/[...path]', {
        path: nextPage.route,
      })}
      class="nextLink link"
    >
      <span class="prefix">
        Next in {series.title}:
      </span>

      <span class="title">
        {nextPage.title}
        <Next aria-hidden="true" />
      </span>
    </a>
  {/if}
</nav>

<style>
  .navigation {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas: 'previous next';
    column-gap: 1rem;
  }

  .link {
    display: grid;
    text-decoration: none;
  }

  .previousLink {
    grid-area: previous;
  }

  .nextLink {
    grid-area: next;
    text-align: end;
  }

  .prefix {
    color: var(--color-neutral-2);
    font-size: 0.875rem;

    @media (prefers-contrast: more) {
      color: var(--color-neutral-5);
    }
  }
</style>
