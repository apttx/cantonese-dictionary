import vercel from '@sveltejs/adapter-vercel'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: vercel(),
    alias: {
      $components: 'src/components/*',
      $stores: 'src/stores/*',
      $css: 'src/css/*',
      $graphql: 'src/modules/graphql.ts',
      $types: '../types/*',
    },
  },
}

export default config
