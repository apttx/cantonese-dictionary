import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'
import unplugin_icons from 'unplugin-icons/vite'

export default defineConfig({
  plugins: [sveltekit(), unplugin_icons({ compiler: 'svelte', scale: 1.25 })],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
})
