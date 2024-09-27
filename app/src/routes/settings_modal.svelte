<script>
  import {
    character_set,
    show_secondary_character_set_if_different,
  } from '$stores/character_set.mjs'
  import { show_pinyin } from '$stores/show_pinyin.mjs'
  import { show_jyutping } from '$stores/show_jyutping.mjs'
  import { preferred_ui_alignment } from '$stores/preferred_ui_alignment.mjs'

  import Modal from '$components/modal.svelte'
  import { chinese_character_font } from '$stores/chinese_character_font'

  /** @type {boolean} */
  export let open
</script>

<Modal
  heading="Site-wide settings"
  bind:visible={open}
>
  <form on:submit|preventDefault>
    <fieldset>
      <legend>Chinese characters</legend>

      <div
        role="presentation"
        class="input_group"
      >
        <label>
          <input
            type="radio"
            name="character_set"
            value="traditional"
            bind:group={$character_set}
          />
          <span>Show traditional</span>
        </label>
        <label>
          <input
            type="radio"
            name="character_set"
            value="simplified"
            bind:group={$character_set}
          />
          <span>Show simplified</span>
        </label>
      </div>
    </fieldset>

    <label>
      <input
        type="checkbox"
        name="show_secondary_character_set_if_different"
        bind:checked={$show_secondary_character_set_if_different}
      />
      <span>Show the characters from the other set if they are different</span>
    </label>

    <fieldset>
      <legend>Chinese Character Font</legend>

      <div
        role="presentation"
        class="input_group"
      >
        <label>
          <input
            type="radio"
            name="character_set"
            value="sans"
            bind:group={$chinese_character_font}
          />
          <span>Sans-serif</span>
        </label>
        <label>
          <input
            type="radio"
            name="character_set"
            value="serif"
            bind:group={$chinese_character_font}
          />
          <span>Serif</span>
        </label>
        <label>
          <input
            type="radio"
            name="character_set"
            value="handwritten"
            bind:group={$chinese_character_font}
          />
          <span>Handwritten (simplified only)</span>
        </label>
      </div>
    </fieldset>

    <fieldset>
      <legend>Romanization</legend>

      <label>
        <input
          type="checkbox"
          bind:checked={$show_pinyin}
        />
        <span>Show pinyin</span>
      </label>
      <label>
        <input
          type="checkbox"
          bind:checked={$show_jyutping}
        />
        <span>Show jyutping</span>
      </label>
    </fieldset>

    <fieldset>
      <legend>Preferred UI alignment (handedness)</legend>

      <div
        role="presentation"
        class="input_group"
      >
        <label>
          <input
            type="radio"
            value="left"
            bind:group={$preferred_ui_alignment}
          />
          <span>Left</span>
        </label>
        <label>
          <input
            type="radio"
            value="right"
            bind:group={$preferred_ui_alignment}
          />
          <span>Right</span>
        </label>
      </div>
    </fieldset>
  </form>
</Modal>

<style>
  form {
    display: grid;
  }

  legend {
    margin-bottom: 0.5rem;
    font-weight: 700;
  }

  label {
    display: block;
    padding-block: 0.5rem;
  }

  fieldset {
    margin-top: 2rem;
  }

  .input_group {
    display: grid;
    grid-auto-flow: column;
    column-gap: 1.5rem;
    justify-content: start;
  }
</style>
