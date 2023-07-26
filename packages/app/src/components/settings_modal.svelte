<script>
  import { character_set } from '$stores/character_set.mjs'
  import { show_pinyin } from '$stores/show_pinyin.mjs'
  import { show_jyutping } from '$stores/show_jyutping.mjs'

  import Modal from './modal.svelte'

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
  </form>
</Modal>

<style>
  form {
    display: grid;
    gap: 2rem;
    margin-top: 2rem;
  }

  legend {
    margin-bottom: 0.25rem;
    font-weight: 500;
  }

  label {
    display: block;
  }

  .input_group {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
</style>
