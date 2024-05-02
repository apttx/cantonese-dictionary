<script lang="ts">
  import { page } from '$app/stores'
  import Chevron from '~icons/mingcute/right-small-line'
  import Home from '~icons/mingcute/home-3-line'
  import { fly } from 'svelte/transition'
  import { cubicIn, cubicOut } from 'svelte/easing'

  export let crumbs: { text: string; route: string }[]
</script>

<nav aria-label="Breadcrumbs">
  <ul class="breadcrumbs">
    <li class="breadcrumb">
      <a
        href="/"
        aria-current={$page.url.pathname === '/' ? 'page' : undefined}
        class="home_link"
      >
        <Home aria-label="Home page" />
      </a>
    </li>

    {#each crumbs as crumb, index}
      <li
        class="breadcrumb chevron_container"
        in:fly={{ opacity: 0, x: -16, duration: 300, easing: cubicOut }}
        out:fly={{ opacity: 0, x: -16, duration: 200, easing: cubicIn }}
      >
        <Chevron aria-hidden="true" />

        <a
          href={crumb.route}
          aria-current={$page.url.pathname === crumb.route ? 'page' : undefined}
          class="breadcrumb_link"
          class:abbreviated={index === crumbs.length - 1}
        >
          {crumb.text}
        </a>
      </li>
    {/each}
  </ul>
</nav>

<style>
  .breadcrumbs {
    --chevron-spacing: -0.4rem;

    display: grid;
    grid-auto-flow: column;
    justify-content: start;
    align-items: center;
    color: var(--color-neutral-3);
  }

  .breadcrumbs :global(svg) {
    display: block;
  }

  .home_link {
    display: grid;
    place-items: center;
    width: 3rem;
    height: 3rem;
  }

  .chevron_container {
    margin-left: var(--chevron-spacing);
  }

  .chevron_container .breadcrumb_link {
    margin-left: var(--chevron-spacing);
  }

  .chevron_container :global(svg) {
    display: block;
    color: var(--color-neutral-1);
  }

  @media (prefers-contrast: more) {
    .breadcrumbs {
      color: var(--color-neutral-5);
    }

    .chevron_container :global(svg) {
      color: var(--color-neutral-5);
    }
  }

  .breadcrumb {
    display: grid;
    grid-auto-flow: column;
    justify-content: start;
    align-items: center;
  }

  .abbreviated {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .breadcrumb_link {
    display: block;
    padding: 1rem;
    line-height: 1;
  }
</style>
