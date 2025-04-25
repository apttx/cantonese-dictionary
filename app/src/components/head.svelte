<script lang="ts">
  import { page } from '$app/state'
  import { PUBLIC_CANONICAL_BASE_URL } from '$env/static/public'

  let {
    title,
    description,
  }: {
    title: string
    description: string
  } = $props()

  const canonicalUrl = $derived.by(() => {
    const canonicalUrl = new URL(PUBLIC_CANONICAL_BASE_URL)

    canonicalUrl.pathname = page.url.pathname
    canonicalUrl.search = page.url.search
    canonicalUrl.hash = page.url.hash

    return canonicalUrl
  })
</script>

<svelte:head>
  <title>{title} | Cantonese Dictionary</title>
  <meta
    name="description"
    content={description}
  />
  <link
    rel="canonical"
    href={canonicalUrl.toString()}
  />
</svelte:head>
