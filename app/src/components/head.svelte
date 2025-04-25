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
    const canonicalUrl = new URL(page.url.pathname, PUBLIC_CANONICAL_BASE_URL)

    return canonicalUrl
  })

  const titleWithSuffix = $derived(
    title === 'Cantonese Dictionary' ? title : `${title} | Cantonese Dictionary`,
  )
</script>

<svelte:head>
  <title>{titleWithSuffix}</title>
  <meta
    name="description"
    content={description}
  />
  <link
    rel="canonical"
    href={canonicalUrl.toString()}
  />
</svelte:head>
