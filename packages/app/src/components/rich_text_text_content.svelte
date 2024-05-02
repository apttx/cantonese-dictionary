<script lang="ts">
  import type { Rich_Text_Text_Element } from '$types/Rich_Text'

  export let content: Rich_Text_Text_Element[]
</script>

{#each content as rich_text_text_element, index}
  {@const format_set = new Set(rich_text_text_element.formats)}
  {#if rich_text_text_element.type === 'subscript'}
    <sub
      class="@formatted"
      class:+bold={format_set.has('bold')}
      class:+italic={format_set.has('italic')}
      class:+strikethrough={format_set.has('line_through')}
      class:+underline={format_set.has('underline')}>{rich_text_text_element.text}</sub
    >
  {:else if rich_text_text_element.type === 'superscript'}
    <sup
      class="@formatted"
      class:+bold={format_set.has('bold')}
      class:+italic={format_set.has('italic')}
      class:+strikethrough={format_set.has('line_through')}
      class:+underline={format_set.has('underline')}>{rich_text_text_element.text}</sup
    >
  {:else if format_set.size}
    <span
      class="@formatted"
      class:+bold={format_set.has('bold')}
      class:+italic={format_set.has('italic')}
      class:+strikethrough={format_set.has('line_through')}
      class:+underline={format_set.has('underline')}>{rich_text_text_element.text}</span
    >
  {:else}
    {rich_text_text_element.text}
  {/if}
{/each}
