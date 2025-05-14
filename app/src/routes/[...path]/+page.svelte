<script lang="ts">
  import StoryblokRichTextDocumentNode from '$storyblok/StoryblokRichTextDocumentNode.svelte'
  import Chevron from '~icons/mingcute/right-line'
  import Home from '~icons/mingcute/home-3-line'
  import Head from '$components/head.svelte'
  import InterSeriesNavigation, {
    getInterSeriesNavigationPages,
  } from './InterSeriesNavigation.svelte'
  import SeriesTeaser from '$storyblok/blocks/SeriesTeaser.svelte'

  let { data } = $props()

  const interSeriesNavigationPages = $derived(getInterSeriesNavigationPages(data))
</script>

<Head
  title={data.title}
  description={data.metaDescription}
/>

{#if data.breadcrumbs.length}
  {@const lastIndex = data.breadcrumbs.length - 1}
  <nav
    aria-label="Breadcrumbs"
    class="breadcrumbs"
  >
    <ol class="breadcrumbList">
      <li class="breadcrumbItem">
        <a
          href="/"
          class="homeLink breadcrumbLink"
        >
          <Home aria-label="Home" />
        </a>
      </li>
      {#each data.breadcrumbs as breadcrumb, index (breadcrumb)}
        <li class="breadcrumbItem">
          <Chevron
            aria-hidden="true"
            class="chevron"
          />

          <a
            href={breadcrumb.pathname}
            aria-current={index === lastIndex ? 'page' : undefined}
            class="breadcrumbLink"
          >
            {breadcrumb.title}
          </a>
        </li>
      {/each}
    </ol>
  </nav>
{/if}

<main class="page">
  <article>
    <h1 class="@heading +1">{data.title}</h1>

    <div
      role="presentation"
      class="content"
    >
      <StoryblokRichTextDocumentNode {...data.content} />
    </div>

    {#if interSeriesNavigationPages}
      <InterSeriesNavigation
        {...interSeriesNavigationPages}
        class="interSeriesNavigation"
      />
    {/if}
  </article>
</main>

{#if data.series.length}
  <aside class="series">
    <SeriesTeaser
      series={data.series}
      headingTemplate={'More from the {title} series'}
    />
  </aside>
{/if}

<style>
  .breadcrumbs {
    margin-top: 1.5rem;
    margin-inline: var(--margin_content_layout);

    @media (min-width: 40rem) {
      margin-top: 2rem;
    }
  }

  .breadcrumbList {
    display: grid;
    grid-auto-flow: column;
    place-content: start;
  }

  .breadcrumbItem {
    display: grid;
    grid-template-columns: repeat(2, auto);
    align-items: center;

    :global(.chevron) {
      display: block;
      color: var(--color-neutral-2);
    }
  }

  .breadcrumbLink {
    display: inline-block;
    padding-inline: 0.5rem;
    padding-block: 1rem;
    font-weight: 500;
    font-size: 0.875rem;
    line-height: 1rem;
  }

  .homeLink {
    padding-block: 0.875rem;
    font-size: 1rem;
  }

  .breadcrumbItem:first-child .breadcrumbLink {
    padding-left: 0;
  }

  .breadcrumbItem:last-child .breadcrumbLink {
    padding-right: 0;
    pointer-events: none;
    text-decoration: none;
  }

  .page {
    margin-top: 1.5rem;
    margin-inline: var(--margin_content_text);

    @media (min-width: 40rem) {
      margin-top: 2rem;
    }
  }

  .page :global(.interSeriesNavigation) {
    margin-top: 4rem;
    margin-inline: var(--margin_content_text);
  }

  .content {
    margin-top: 2rem;
  }

  .series {
    position: sticky;
    top: 0;
    margin-top: 4rem;
    margin-inline: var(--margin_content_text);
  }
</style>
