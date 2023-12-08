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
  <p class="introduction">Change the appearance of the flashcards.</p>

  <div
    class="settings"
    role="presentation"
  >
    <fieldset class="front_settings">
      <legend class="settings_heading">Front</legend>

      <figure class="flashcard_face">
        <Dynamic_Flashcard_Face
          configuration={$flashcard_front_configuration}
          phrase={demo_phrase}
        />
        <figcaption class="flashcard_face_caption colored_base-neutral">
          Example of the front of a flashcard
        </figcaption>
      </figure>

      <label class="settings_label">
        <span>Show characters</span>
        <input
          type="checkbox"
          bind:checked={$flashcard_front_configuration.characters}
        />
      </label>
      <label class="settings_label">
        <span>Show romanization</span>
        <input
          type="checkbox"
          bind:checked={$flashcard_front_configuration.romanization}
        />
      </label>
      <label class="settings_label">
        <span>Show english</span>
        <input
          type="checkbox"
          bind:checked={$flashcard_front_configuration.english}
        />
      </label>
    </fieldset>

    <fieldset class="front_settings">
      <legend class="settings_heading">Back</legend>

      <figure class="flashcard_face">
        <Dynamic_Flashcard_Face
          configuration={$flashcard_back_configuration}
          phrase={demo_phrase}
        />
        <figcaption class="flashcard_face_caption colored_base-neutral">
          Example of the back of a flashcard
        </figcaption>
      </figure>

      <label class="settings_label">
        <span>Show characters</span>
        <input
          type="checkbox"
          bind:checked={$flashcard_back_configuration.characters}
        />
      </label>
      <label class="settings_label">
        <span>Show romanization</span>
        <input
          type="checkbox"
          bind:checked={$flashcard_back_configuration.romanization}
        />
      </label>
      <label class="settings_label">
        <span>Show english</span>
        <input
          type="checkbox"
          bind:checked={$flashcard_back_configuration.english}
        />
      </label>
    </fieldset>
  </div>
</Modal>

<style>
  .introduction {
    margin-top: 1.75rem;
  }

  .settings {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-top: 2rem;
  }

  .flashcard_face {
    grid-area: flashcard_face;
    margin-block: 1rem;
  }
  .flashcard_face_caption {
    margin-top: 0.5rem;
    font-size: 0.875rem;
  }

  .settings_heading {
    font-weight: bold;
  }

  .settings_label {
    display: block;
    padding-block: 0.5rem;
  }

  @media (min-width: 50rem) {
    .settings {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
