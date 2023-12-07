<script>
  import Github from '~icons/mingcute/github-line'
  import ThankYou from '~icons/mingcute/heart-fill'

  const open_source_links = [
    {
      text: 'CC-CEDICT',
      url: 'https://cc-cedict.org/wiki/',
    },
    {
      text: 'CC-Canto',
      url: 'https://cantonese.org/',
    },
    {
      text: 'SQLite',
      url: 'https://www.sqlite.org/index.html',
    },
    {
      text: 'GraphQL Yoga',
      url: 'https://github.com/dotansimha/graphql-yoga',
    },
    {
      text: 'SvelteKit',
      url: 'https://github.com/sveltejs/kit',
    },
    {
      text: 'URQL',
      url: 'https://github.com/urql-graphql/urql',
    },
    {
      text: 'Fontsource',
      url: 'https://github.com/fontsource/fontsource',
    },
    {
      text: 'MingCute',
      url: 'https://github.com/Richard9394/MingCute',
    },
    {
      text: 'Iconify',
      url: 'https://iconify.design/',
    },
    {
      text: 'unplugin-icons',
      url: 'https://github.com/antfu/unplugin-icons',
    },
  ]
</script>

<footer class="colored_brand-1">
  <nav class="footer_content">
    <div role="presentation">
      <h2 class="open_source_heading">
        Built with Open Source
        <span class="screen_reader_only">&lpar;</span>
        <ThankYou aria-label="Thank you!" />
        <span class="screen_reader_only">&rpar;</span>
      </h2>

      <ul class="open_source_links">
        {#each open_source_links as link}
          <li>
            <a
              href={link.url}
              rel="noreferrer noopener"
            >
              {link.text}
            </a>
          </li>
        {/each}
      </ul>
    </div>

    <div role="presentation">
      <h2>Links</h2>

      <ul>
        <li>
          <a
            href="https://github.com/apttx/cantonese-dictionary"
            rel="noreferrer noopener"
            class="icon_link"
          >
            <Github aria-hidden="true" />
            <span>GitHub</span>
          </a>
        </li>
      </ul>

      <p class="hosted_on">
        Hosted on <a
          href="https://vercel.com/"
          rel="noreferrer noopener">Vercel</a
        >.
      </p>
    </div>
  </nav>

  <p class="signature_and_license">
    With &hearts; by aptt. Licensed under CC-BY-SA 3.0 and GPL 3.0.
  </p>
</footer>

<style>
  footer {
    padding-block: 4rem;
  }

  .footer_content {
    display: grid;
    justify-content: start;
    gap: 3rem 8rem;
    margin-inline: var(--margin_content_layout);
    /* align content with header content for visual appeal */
    padding-inline: 1rem;
  }

  h2 {
    font-weight: 700;
    font-size: 1.125rem;
  }

  ul {
    margin-top: 1rem;
  }

  a {
    display: inline-block;
    padding-block: 0.25rem;
  }

  .icon_link {
    display: grid;
    grid-auto-flow: column;
    justify-content: start;
    align-items: center;
    gap: 0.25rem;
  }

  .open_source_links li {
    background-image: url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cpath d="M24 0v24H0V0h24ZM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036c-.01-.003-.019 0-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.016-.018Zm.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01l-.184-.092Z"%2F%3E%3Cpath fill="white" d="M14.536 12.707a1 1 0 0 0 0-1.414l-2.829-2.829A1 1 0 0 0 10 9.172v5.656a1 1 0 0 0 1.707.708l2.829-2.829Z"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E');
    background-position: -0.6em center;
    background-size: 1.5em;
    background-repeat: no-repeat;
    padding-left: 1.25rem;
    list-style-position: inside;
  }

  .hosted_on {
    margin-top: 2rem;
  }

  .signature_and_license {
    margin-inline: var(--margin_content_layout);
    margin-top: 2.75rem;
    /* align content with header content for visual appeal */
    padding-inline: 1rem;
    font-size: 0.8125rem;
  }

  .open_source_heading :global(svg) {
    margin-left: 0.25rem;
  }

  @media (min-width: 40rem) {
    .footer_content {
      grid-auto-flow: column;
    }
  }
</style>
