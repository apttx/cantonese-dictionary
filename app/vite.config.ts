import { sveltekit } from '@sveltejs/kit/vite'
import unplugin_icons from 'unplugin-icons/vite'
import { type UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [
    sveltekit(),
    unplugin_icons({
      compiler: 'svelte',
      scale: 1.25,
    }),
  ],
  server: {
    fs: {
      allow: ['../api/'],
    },
  },
}

export default config
