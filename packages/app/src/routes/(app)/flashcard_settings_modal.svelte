<script>
  import Modal from '$components/modal.svelte'
  import Dynamic_Flashcard_Face from '$components/dynamic_flashcard_face.svelte'
  import {
    flashcard_front_configuration,
    flashcard_back_configuration,
  } from '$stores/flashcard_settings.mjs'

  /** @type {Phrase} */
  const demo_phrase = {
    id: '9e7b2baf38600d606d33363f5142b228',
    english: 'dictionary',
    traditional: '辭書',
    simplified: '辞书',
    jyutping: 'ci4 syu1',
    pinyin: 'ci2 shu1',
    senses: [],
  }

  /** @type {boolean} */
  export let visible
</script>

<Modal
  heading="Flashcard settings"
  bind:visible
>
  <div
    class="settings"
    role="presentation"
  >
    <div
      class="flashcard_front phrase_container"
      role="presentation"
    >
      <Dynamic_Flashcard_Face
        configuration={$flashcard_front_configuration}
        phrase={demo_phrase}
      />
    </div>
    <div class="front_settings">
      <label>
        <span>Show characters</span>
        <input
          type="checkbox"
          bind:checked={$flashcard_front_configuration.characters}
        />
      </label>
      <label>
        <span>Show romanization</span>
        <input
          type="checkbox"
          bind:checked={$flashcard_front_configuration.romanization}
        />
      </label>
      <label>
        <span>Show english</span>
        <input
          type="checkbox"
          bind:checked={$flashcard_front_configuration.english}
        />
      </label>
    </div>

    <div
      class="flashcard_back phrase_container"
      role="presentation"
    >
      <Dynamic_Flashcard_Face
        configuration={$flashcard_back_configuration}
        phrase={demo_phrase}
      />
    </div>
    <div class="front_settings">
      <label>
        <span>Show characters</span>
        <input
          type="checkbox"
          bind:checked={$flashcard_back_configuration.characters}
        />
      </label>
      <label>
        <span>Show romanization</span>
        <input
          type="checkbox"
          bind:checked={$flashcard_back_configuration.romanization}
        />
      </label>
      <label>
        <span>Show english</span>
        <input
          type="checkbox"
          bind:checked={$flashcard_back_configuration.english}
        />
      </label>
    </div>
  </div>
</Modal>

<style>
  .settings {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:
      'flashcard_front flashcard_back'
      'front_settings back_settings';
    gap: 2rem;
    margin-top: 2rem;
  }
  .flashcard_front {
    grid-area: flashcard_front;
  }
  .flashcard_back {
    grid-area: flashcard_back;
  }
  .settings label {
    display: block;
    padding-block: 0.5rem;
  }
</style>
