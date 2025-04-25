<script lang="ts">
  export let title: string
  export let description: string
</script>

<svelte:head>
  <title>{title} | Cantonese Dictionary</title>
  <meta
    name="description"
    content={description}
  />
</svelte:head>

<h1 class="screen_reader_only">{title}</h1>
