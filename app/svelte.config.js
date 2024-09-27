import auto from '@sveltejs/adapter-auto'
import vercel from '@sveltejs/adapter-vercel'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

const adapter = process.env.USE_VERCEL_ADAPTER ? vercel() : auto()

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter,
    alias: {
      $components: 'src/components/*',
      $stores: 'src/stores/*',
      $css: 'src/css/*',
      $graphql: 'src/modules/graphql.mjs',
      $types: '../types/*',
    },
  },
}

export default config
