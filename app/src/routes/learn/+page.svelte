<script lang="ts">
  export let data
</script>

<h1 class="@heading +1 @content +text @spaced">Learn</h1>

<p class="@content +text @spaced +sibling">Learn a language!</p>

<ul class="@content +text @grid +loose @spaced">
  {#each data.languages as language}
    <li class="@spaced +sibling">
      <a
        href="/learn/{language.slug}"
        class="language_link"
        style:--color={language.color}
      >
        <span
          role="img"
          aria-hidden="true"
          class="language_icon"
          style:--color={language.color}
        >
          {language.iso_639_code.toUpperCase()}
        </span>

        <span class="language_name">{language.name}</span>

        <span class="language_introduction">{language.introduction}</span>
      </a>
    </li>
  {/each}
</ul>

<style>
  .language_link {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas:
      'icon name'
      'intro intro';
    align-items: center;
    gap: 1rem;
  }

  .language_icon {
    display: flex;
    grid-area: icon;
    place-content: center;
    place-items: center;
    border-radius: 0.2rem;
    background-color: var(--color);
    width: 2.5rem;
    height: 2.5rem;
    color: white;
    font-weight: bold;
  }

  .language_name {
    grid-area: name;
  }

  .language_introduction {
    grid-area: intro;
  }
</style>
