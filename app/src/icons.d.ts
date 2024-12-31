import 'unplugin-icons/types/svelte'

declare module '~icons/mingcute/*' {
  import type { Component } from 'svelte'
  import type { SvelteHTMLElements } from 'svelte/elements'

  const component: Component<SvelteHTMLElements['svg']>

  export default component
}
