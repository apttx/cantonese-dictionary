<script>
  /** @type {string} */
  export let title
  /** @type {string} */
  export let description
</script>

<svelte:head>
  <title>{title} | Cantonese Dictionary</title>
  <meta
    name="description"
    content={description}
  />
</svelte:head>

<h1 class="screen_reader_only">Dictionary</h1>
