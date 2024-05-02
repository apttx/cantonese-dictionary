import type { Player, YT } from '$youtube'

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    interface PageData {
      title?: string
      breadcrumbs?: {
        text: string
        route: string
      }[]
    }
    // interface Platform {}
  }

  interface Window {
    onYouTubeIframeAPIReady: () => void
    is_youtube_api_ready: boolean
    get_youtube_player: (iframe_id: string) => Promise<Player>
    YT: YT
  }
}

export {}

import 'unplugin-icons/types/svelte'
import '../../jsconfig.json'
import 'vite-plugin-pwa/info'
import 'vite-plugin-pwa/pwa-assets'

declare module '$content/*' {
  import { SvelteComponent } from 'svelte'

  const component: SvelteComponent

  export default component
}

declare module '*.svx.md' {
  import { SvelteComponent } from 'svelte'

  const component: SvelteComponent

  export default component
}
