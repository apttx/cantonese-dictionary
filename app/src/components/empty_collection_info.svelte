<script>
  import { resolve } from '$app/paths'
</script>

<h2>Your collection is empty.</h2>

<p>
  Head over to
  <a
    href={resolve('/dictionary')}
    class="cd_link"
  >
    the dictionary
  </a>
  and use the save icon on a phrase.
</p>

<style>
  h2 {
    font-weight: 500;
    font-size: 1.125rem;
  }

  p {
    margin-top: 1rem;
  }
</style>
