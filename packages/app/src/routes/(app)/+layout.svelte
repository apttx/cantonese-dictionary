<script>
  import Footer from '$components/footer.svelte'
  import Header from '$components/header.svelte'

  import {main_inert} from '$stores/main_inert.mjs'
</script>

<Header />

<main inert={$main_inert}>
  <slot />
</main>

<Footer />

<style>
  main {
    min-height: 80vh;
  }
</style>
