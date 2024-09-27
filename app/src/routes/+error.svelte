<script>
  import { page } from '$app/stores'
  import Head from '$components/head.svelte'

  $: heading = $page.status === 404 ? 'This page does not exist' : "Oh no, something's broken"
</script>

<Head
  title={heading}
  description="An error occurred."
/>

<div>
  <h1>{heading}</h1>

  <p>
    Try visiting
    <a
      href="/"
      class="cd_link"
    >
      the search page
    </a>
    or
    <a
      href="/dictionary"
      class="cd_link"
    >
      the dictionary
    </a>
    .
  </p>
</div>

<style>
  h1 {
    font-weight: 500;
    font-size: 1.25rem;
  }

  p {
    margin-top: 1rem;
  }

  div {
    display: grid;
    align-content: center;
    margin-inline: var(--margin_content_text);
    height: 100vh;
  }
</style>
