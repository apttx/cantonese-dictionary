import { sveltekit } from '@sveltejs/kit/vite'
import unplugin_icons from 'unplugin-icons/vite'

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit(), unplugin_icons({ compiler: 'svelte', scale: 1.25 })],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
}

export default config
