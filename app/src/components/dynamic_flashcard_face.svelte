<script lang="ts">
  import { character_set } from '$stores/character_set.ts'
  import type { Flashcard_Configuration } from '$stores/flashcard_settings'
  import { show_jyutping } from '$stores/show_jyutping.ts'
  import { show_pinyin } from '$stores/show_pinyin.ts'
  import { type Phrase } from '$types/Phrase.ts'

  export let configuration: Flashcard_Configuration
  export let phrase: Phrase
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
    gap: 0.5rem;
    margin: auto;
    box-shadow: 0 0.2rem 0.5rem #00000022;
    border-radius: 0.2rem;
    padding: 2rem;
    min-width: 16rem;
    min-height: 8rem;
    text-align: center;
  }
</style>
