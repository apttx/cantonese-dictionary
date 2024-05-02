<script lang="ts">
  import 'quill/dist/quill.snow.css'
  import { onMount } from 'svelte'
  import { get_ops, get_rich_text, toolbar } from '$modules/quill'
  import type { Rich_Text_Element } from '$modules/rich_text'
  import Expand from '~icons/mingcute/layout-leftbar-open-line'
  import Collapse from '~icons/mingcute/layout-leftbar-close-line'

  export let rich_text: Rich_Text_Element[] = []

  let quill_editor_container: HTMLDivElement

  onMount(async () => {
    const quill_module = await import('quill')
    const quill = new quill_module.default(quill_editor_container, {
      placeholder: `Edit the page's content here`,
      theme: 'snow',
      modules: {
        toolbar,
      },
    })

    const initial_contents = get_ops(rich_text)
    quill.setContents(initial_contents)
    rich_text = get_rich_text(initial_contents)

    quill.on('text-change', () => {
      const ops = quill.getContents().ops

      rich_text = get_rich_text(ops)
    })
  })

  let expanded = true

  const collapse = () => {
    expanded = false
  }

  const expand = () => {
    expanded = true
  }

  const toggle_expansion = () => {
    if (expanded) {
      return collapse()
    }

    return expand()
  }
</script>

<div
  role="presentation"
  class="editable_content @content.variables"
  class:expanded
>
  <button
    on:click={toggle_expansion}
    class="expansion_button @button @content.variables"
    class:collapsed={!expanded}
  >
    {#if expanded}
      <Collapse
        aria-label="Hide editor"
        aria-hidden="true"
      />
      Hide editor
    {:else}
      <Expand aria-label="Show editor" />
      Show editor
    {/if}
  </button>

  <div
    role="presentation"
    class="editor_container"
    class:expanded
  >
    <div
      role="presentation"
      bind:this={quill_editor_container}
      class="editor"
    />
  </div>

  <div
    role="presentation"
    class="content_container"
  >
    <slot />
  </div>
</div>

<style>
  .editable_content {
    display: grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: 0rem 1fr;
    grid-template-areas: 'button content' 'editor content';
    align-content: start;
  }

  .editable_content.expanded {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-inline: var(--margin);
  }

  .expansion_button {
    display: grid;
    grid-auto-flow: column;
    grid-area: button;
    align-items: center;
    align-self: start;
    justify-self: start;
    gap: 0.8rem;
    z-index: 1;
    margin-top: 0.25rem;
    width: max-content;
  }

  .expansion_button.collapsed {
    position: absolute;
    margin-left: var(--margin);
  }

  .editor_container {
    display: none;
    grid-area: editor;
    z-index: 0;
  }

  .editor_container.expanded {
    display: block;
  }

  .editor {
    min-height: 20rem;
    resize: vertical;
  }

  .content_container {
    grid-area: content;
    z-index: 0;
  }
</style>
