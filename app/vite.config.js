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
      strategies: 'generateSW',
      mode: 'production',
      scope: '/',
      base: '/',
      pwaAssets: {
        config: true,
      },
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
      injectManifest: {
        globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}'],
      },
      workbox: {
        globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}'],
      },
      devOptions: {
        enabled: true,
        suppressWarnings: process.env.SUPPRESS_WARNING === 'true',
        type: 'module',
        navigateFallback: '/',
      },
      // if you have shared info in svelte config file put in a separate module and use it also here
      kit: {
        includeVersionFile: true,
      },
    }),
  ],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
}

export default config
