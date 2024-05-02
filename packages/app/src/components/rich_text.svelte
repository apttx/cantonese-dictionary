<script lang="ts">
  import type { Rich_Text_Element } from '$types/Rich_Text'
  import Rich_Text_Text_Content from './rich_text_text_content.svelte'

  export let content: Rich_Text_Element[]
</script>

{#each content as rich_text_element, index}
  {#if rich_text_element.type === 'heading'}
    {@const heading_element = `h${rich_text_element.level}`}
    {@const heading_modifier_class = `+${rich_text_element.level}`}
    <svelte:element
      this={heading_element}
      class="@heading {heading_modifier_class} @content +text @spaced"
    >
      <Rich_Text_Text_Content content={rich_text_element.content} />
    </svelte:element>
  {:else if rich_text_element.type === 'paragraph'}
    <p
      class="@content +text @spaced +sibling"
      class:+close={index === 0}
    >
      <Rich_Text_Text_Content content={rich_text_element.content} />
    </p>
  {:else if rich_text_element.type === 'image'}
    <figure class="@content +text @spaced">
      <picture>
        <img
          src={rich_text_element.url}
          alt={rich_text_element.alt_text}
          height={rich_text_element.height}
          width={rich_text_element.width}
          class="image"
        />
      </picture>

      {#if rich_text_element.caption}
        <figcaption>{rich_text_element.caption}</figcaption>
      {/if}
    </figure>
  {:else if rich_text_element.type === 'list'}
    {@const list_element = rich_text_element.list_type === 'ordered' ? 'ol' : 'ul'}
    <svelte:element
      this={list_element}
      class="@content +text @spaced +close"
      class:ordered_list={rich_text_element.list_type === 'ordered'}
      class:unordered_list={rich_text_element.list_type === 'unordered'}
    >
      {#each rich_text_element.items as list_item}
        <li>
          <Rich_Text_Text_Content content={list_item.content} />
        </li>
      {/each}
    </svelte:element>
  {/if}
{/each}

<style>
  .ordered_list {
    counter-reset: ordered_list_counter;
    padding-left: 3rem;
  }

  .ordered_list li {
    position: relative;
    counter-increment: ordered_list_counter;
    margin-top: 0.4rem;
  }

  .ordered_list li:first-child {
    margin-top: 0;
  }

  .ordered_list li:before {
    position: absolute;
    left: -1.4rem;
    content: counter(ordered_list_counter) '.';
  }

  .image {
    margin: auto;
    border-radius: 0.2rem;
  }

  figcaption {
    margin-top: 0.6rem;
    padding-inline: 0.6rem;
    color: var(--color-neutral-4);
    font-size: 0.9rem;
  }
</style>
