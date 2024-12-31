<script lang="ts">
  export let data
</script>

<h1 class="@heading +1 @content +page @spaced">{data.name}</h1>

<p class="@text @content +page @spaced +close">{data.introduction}</p>

<h2 class="@heading +2 @content +page @spaced">Basics</h2>

<ul class="@content +page @spaced +close @grid +1 #text+2 #page+3">
  {#each data.aspects as aspect}
    <li class="aspect_item">
      <a
        href="/learn/{data.slug}/{aspect.slug}"
        class="aspect_tile"
        style:--color={aspect.color}
      >
        <span class="aspect_title @heading +3">{aspect.title}</span>

        <span class="aspect_description @spaced +sibling">{aspect.description}</span>
      </a>
    </li>
  {/each}
</ul>

<h2 class="@heading +2 @content +page @spaced">Practice</h2>

{#if data.videos.length}
  <ul class=" @content +page @spaced +close @grid +1 #text+2">
    {#each data.videos as video}
      <li class="video_item">
        <a href="/learn/{data.slug}/videos/{video.slug}">
          <img
            src={video.thumbnail.url}
            alt={video.title}
            class="video_thumbnail"
          />

          <span class="video_title @spaced +sibling">
            {video.title}
          </span>
        </a>
      </li>
    {/each}
  </ul>
{:else}
  <p class="@content +page @spaced +close">There are no videos to practice this language yet.</p>
{/if}

<style>
  .aspect_item {
    display: grid;
    place-items: stretch;
  }

  .aspect_tile {
    display: block;
    border-width: 0.1rem;
    border-color: var(--color);
    border-radius: 0.2rem;
    padding: 1.4rem;
  }

  .aspect_description {
    display: block;
  }

  .video_item {
    display: grid;
    place-items: stretch;
  }

  .video_thumbnail {
    border-radius: 0.2rem;
  }

  .video_title {
    display: block;
  }
</style>
