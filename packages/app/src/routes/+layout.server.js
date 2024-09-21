// @ts-expect-error broken env types
import { ISR_BYPASS_TOKEN } from '$env/static/private'

/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
  // incremental static regeneration
  isr: {
    // never expire
    expiration: false,
    bypassToken: ISR_BYPASS_TOKEN,
  },
}

export const prerender = false

export const ssr = true
