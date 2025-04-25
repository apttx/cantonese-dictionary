<script lang="ts">
  import StoryblokRichTextDocumentNode from '$storyblok/StoryblokRichTextDocumentNode.svelte'
  import Chevron from '~icons/mingcute/right-line'
  import Home from '~icons/mingcute/home-3-line'

  let { data } = $props()
</script>

<svelte:head>
  <title>{data.title} | Cantonese Dictionary</title>
  <meta
    name="description"
    content={data.metaDescription}
  />
</svelte:head>

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
      {#each data.breadcrumbs as breadcrumb, index}
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
  </article>
</main>

<style>
  .breadcrumbs {
    margin-top: 2rem;
    margin-inline: var(--margin_content_layout);
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
    margin-top: 2rem;
    margin-inline: var(--margin_content_text);
  }

  .content {
    margin-top: 2rem;
  }
</style>
