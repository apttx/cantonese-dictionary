<script lang="ts">
  import Replay from '~icons/mingcute/repeat-line'

  let { characters }: { characters: string[] } = $props()

  let animation_replay_keys = $state(characters.map(() => 0))
  const replay_animation = async (index: number) => {
    animation_replay_keys[index] = Date.now()
  }
</script>

<div
  role="presentation"
  class="container"
>
  {#each characters as character, index}
    {@const animation_replay_key = animation_replay_keys[index]}
    {@const code_point = character.codePointAt(0)}
    {@const image_url = `https://raw.githubusercontent.com/skishore/makemeahanzi/refs/heads/master/svgs/${code_point}.svg#${animation_replay_key}`}
    <div
      role="presentation"
      class="character_container"
    >
      <div
        role="presentation"
        class="image_container"
      >
        <img
          alt="Stroke order animation of {character}"
          src={image_url}
          height={160}
          width={160}
          class="image"
        />
      </div>

      <button
        class="replay_button cd_button"
        onclick={() => {
          replay_animation(index)
        }}
      >
        <Replay aria-label="Replay animation of {character}" />
      </button>
    </div>
  {/each}
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: repeat(auto-fit, 16rem);
    row-gap: 3rem;
  }

  .character_container {
    display: grid;
  }

  .image_container {
    border-top-width: 0.2rem;
    border-bottom-width: 0.2rem;
    border-color: var(--color-neutral-1);
    aspect-ratio: 1 / 1;
  }

  .image {
    display: grid;
    align-content: center;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .replay_button {
    justify-self: center;
  }
</style>
