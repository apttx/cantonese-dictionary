import { sveltekit } from '@sveltejs/kit/vite'
import unplugin_icons from 'unplugin-icons/vite'
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [
    sveltekit(),
    unplugin_icons({
      compiler: 'svelte',
      scale: 1.25,
    }),
    SvelteKitPWA({
      devOptions: {
        enabled: true,
      },
      mode: 'development',
      manifest: {
        short_name: 'Cantonese Dictionary',
        name: 'Cantonese Dictionary',
        background_color: '#cc2633',
        theme_color: '#cc2633',
        categories: ['education'],
        icons: [
          {
            src: '/favicon.svg',
            type: 'image/svg',
            purpose: 'any',
          },
        ],
      },
    }),
  ],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
}

export default config
