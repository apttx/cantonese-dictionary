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

  <form
    on:submit|preventDefault
    class="settings"
  >
    <fieldset class="front_settings">
      <legend class="settings_heading">Front</legend>

      <figure class="flashcard_figure">
        <Dynamic_Flashcard_Face
          configuration={$flashcard_front_configuration}
          phrase={demo_phrase}
        />
        <figcaption class="flashcard_face_caption colored_base-neutral">
          Example of the front of a flashcard
        </figcaption>
      </figure>

      <label class="settings_label">
        <input
          type="checkbox"
          bind:checked={$flashcard_front_configuration.characters}
        />
        <span>Show characters</span>
      </label>
      <label class="settings_label">
        <input
          type="checkbox"
          bind:checked={$flashcard_front_configuration.romanization}
        />
        <span>Show romanization</span>
      </label>
      <label class="settings_label">
        <input
          type="checkbox"
          bind:checked={$flashcard_front_configuration.english}
        />
        <span>Show english</span>
      </label>
    </fieldset>

    <fieldset class="front_settings">
      <legend class="settings_heading">Back</legend>

      <figure class="flashcard_figure">
        <Dynamic_Flashcard_Face
          configuration={$flashcard_back_configuration}
          phrase={demo_phrase}
        />
        <figcaption class="flashcard_face_caption colored_base-neutral">
          Example of the back of a flashcard
        </figcaption>
      </figure>

      <label class="settings_label">
        <input
          type="checkbox"
          bind:checked={$flashcard_back_configuration.characters}
        />
        <span>Show characters</span>
      </label>
      <label class="settings_label">
        <input
          type="checkbox"
          bind:checked={$flashcard_back_configuration.romanization}
        />
        <span>Show romanization</span>
      </label>
      <label class="settings_label">
        <input
          type="checkbox"
          bind:checked={$flashcard_back_configuration.english}
        />
        <span>Show english</span>
      </label>
    </fieldset>
  </form>
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

  .flashcard_figure {
    margin-top: 1rem;
    margin-bottom: 1.25rem;
  }
  .flashcard_face_caption {
    margin-top: 0.75rem;
    font-size: 0.875rem;
  }

  .settings_heading {
    font-weight: 700;
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
