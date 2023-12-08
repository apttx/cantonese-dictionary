<script>
  import { character_set } from '$stores/character_set.mjs'
  import { show_jyutping } from '$stores/show_jyutping.mjs'
  import { show_pinyin } from '$stores/show_pinyin.mjs'

  /** @type {import('$stores/flashcard_settings.mjs').Flashcard_Configuration} */
  export let configuration
  /** @type {Phrase} */
  export let phrase
</script>

<div class="flashcard">
  {#if configuration.characters}
    <span class="cd_hanzi">
      {phrase[$character_set]}
    </span>
  {/if}
  {#if configuration.romanization}
    {#if $show_pinyin}
      <span>
        {phrase.pinyin}
      </span>
    {/if}
    {#if $show_jyutping}
      <span>
        {phrase.jyutping}
      </span>
    {/if}
  {/if}
  {#if configuration.english}
    <span>
      {phrase.english}
    </span>
  {/if}
</div>

<style>
  .flashcard {
    display: grid;
    align-content: center;
    margin: auto;
    box-shadow: 0 0.2rem 0.5rem #00000022;
    border-radius: 0.2rem;
    padding: 2rem;
    min-width: 16rem;
    min-height: 8rem;
    text-align: center;
  }
</style>
