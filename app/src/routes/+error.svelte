<script lang="ts">
  import { resolve } from '$app/paths'
  import { page } from '$app/stores'
  import Head from '$components/head.svelte'

  $: heading = $page.status === 404 ? 'This page does not exist' : "Oh no, something's broken"
</script>

<Head
  title={heading}
  description="An error occurred."
/>

<main class="contentContainer">
  <h1 class="mainHeading @heading +1">{heading}</h1>

  <p>
    Try visiting
    <a
      href={resolve('/dictionary')}
      class="cd_link"
    >
      the dictionary
    </a>.
  </p>
</main>

<style>
  .contentContainer {
    margin-inline: var(--margin_content_text);
  }

  .mainHeading {
    margin-top: 3rem;

    @media (min-width: 40rem) {
      margin-top: 6rem;
    }
  }

  p {
    margin-top: 1rem;
  }
</style>
