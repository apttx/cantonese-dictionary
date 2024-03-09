<script>
  import { pwaInfo } from 'virtual:pwa-info'
  import { pwaAssetsHead } from 'virtual:pwa-assets/head'
</script>

<svelte:head>
  {#if pwaInfo}
    <link
      rel="manifest"
      href={pwaInfo.webManifest.href}
      crossorigin={pwaInfo.webManifest.useCredentials ? 'use-credentials' : undefined}
    />
  {/if}
  {#if pwaAssetsHead.themeColor}
    <meta
      name="theme-color"
      content={pwaAssetsHead.themeColor.content}
    />
  {/if}
  {#each pwaAssetsHead.links as link}
    <link {...link} />
  {/each}
</svelte:head>
