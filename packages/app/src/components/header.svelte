<script>
  import { createEventDispatcher } from 'svelte'

  import Cog from '~icons/mingcute/settings-5-line'
  import Menu from '~icons/mingcute/menu-line'
  import Search from '~icons/mingcute/search-2-line'
  import Dictionary from '~icons/mingcute/book-2-line'
  import Collection from '~icons/mingcute/notebook-2-line'
  import Revise from '~icons/mingcute/book-6-line'

  import { page } from '$app/stores'

  /** @type {import('svelte').EventDispatcher<{ toggle_settings: void }>} */
  const dispatch = createEventDispatcher()

  /** @type {boolean} */
  let menu_open = false

  const close_menu = () => {
    menu_open = false
  }
</script>

<svelte:window
  on:keydown={(event) => {
    if (event.key === 'Escape') {
      menu_open = false
    }
  }}
/>

<header>
  <div
    role="presentation"
    class="header_bar colored_brand-1"
    class:menu_open
  >
    <nav>
      <ul class:open={menu_open}>
        <li>
          <a
            href="/"
            on:click={close_menu}
            class:active={$page.url.pathname === '/'}
          >
            <Search aria-label="Search" />

            <span class="link_text">Search</span>
          </a>
        </li>
        <li>
          <a
            href="/dictionary"
            on:click={close_menu}
            class:active={$page.url.pathname === '/dictionary'}
          >
            <Dictionary aria-label="Dictionary" />

            <span class="link_text">Dictionary</span>
          </a>
        </li>
        <li>
          <a
            href="/collection"
            on:click={close_menu}
            class:active={$page.url.pathname === '/collection'}
          >
            <Collection aria-label="Collection" />

            <span class="link_text">Collection</span>
          </a>
        </li>
        <li>
          <a
            href="/revise"
            on:click={close_menu}
            class:active={$page.url.pathname === '/revise'}
          >
            <Revise aria-label="Revise" />

            <span class="link_text">Revise</span>
          </a>
        </li>
      </ul>
    </nav>

    <button
      class="menu_button"
      title="Toggle menu"
      on:click={() => {
        menu_open = !menu_open
      }}
    >
      <Menu aria-label="Toggle menu" />
    </button>

    <button
      class="settings_button"
      title="Settings"
      on:click={() => {
        close_menu()
        dispatch('toggle_settings')
      }}
    >
      <Cog aria-label="Settings" />
    </button>
  </div>
</header>

<style>
  header {
    position: sticky;
    top: 0rem;
    z-index: 100;
    padding-block: 1rem;
  }

  .header_bar {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-areas: 'navigation settings';
    grid-auto-flow: column;
    align-items: start;
    margin-inline: var(--margin_content_layout);
    box-shadow: 0 0.5rem 1.5rem #00000022;
    border-radius: 0.2rem;
    line-height: 1rem;
  }

  ul {
    display: grid;
    grid-auto-flow: column;
    justify-content: start;
    align-items: start;
  }

  @media not (min-width: 40rem) {
    ul.open {
      grid-auto-flow: row;
    }

    ul.open .link_text {
      position: initial;
      visibility: initial;
      pointer-events: all;
    }

    ul:not(.open) a.active {
      background-image: linear-gradient(to bottom, currentColor, currentColor);
      background-position: center 2.5rem;
      background-size: 1.75rem var(--underline_thickness);
      background-repeat: no-repeat;
    }
  }

  @media not (min-width: 40rem) {
    .link_text {
      position: absolute;
      visibility: hidden;
      pointer-events: none;
    }
  }

  a {
    --underline_thickness: 0.15rem;

    display: grid;
    grid-auto-flow: column;
    justify-content: start;
    gap: 0.75em;
    padding-inline: 1em;
    padding-block: 1em;
    font-weight: 700;
  }

  @media not (min-width: 40rem) {
    .link_text {
      position: absolute;
      visibility: hidden;
      pointer-events: none;
    }
  }

  @media (min-width: 40rem) {
    a {
      gap: 0.5em;
      writing-mode: horizontal-tb;
    }
  }

  a :global(svg) {
    position: relative;
    top: -0.1em;
    width: auto;
    height: 100%;
  }

  a.active {
    text-decoration: underline;
    text-decoration-thickness: var(--underline_thickness);
    text-underline-offset: 0.4rem;
  }

  .settings_button {
    grid-area: settings;
  }

  @media (min-width: 40rem) {
    .menu_button {
      display: none;
    }
  }

  button {
    padding-inline: 1em;
    padding-block: 1em;
  }
</style>
