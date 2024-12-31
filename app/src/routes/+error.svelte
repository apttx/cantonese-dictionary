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
  <h1 class="@heading +1 @content +text">{heading}</h1>

  <p class="@content +text">
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
  p {
    margin-top: 1rem;
  }

  div {
    display: grid;
    align-content: center;
    padding-block: 6rem;
    min-height: calc(100svh - 14.25rem);
  }
</style>
