<script lang="ts">
  import Play from '~icons/mingcute/play-line'
  import Pause from '~icons/mingcute/pause-line'
  import Loading from '~icons/mingcute/loading-fill'
  import { page } from '$app/stores'
  import { onMount, onDestroy } from 'svelte'
  import { type Player, type State_Change_Event, Player_State } from '$youtube'
  import type { Track_Datum } from '$modules/transcript'
  import Transcript_Editor from './Transcript_Editor.svelte'
  import type { Transcript } from '$types/Transcript'

  export let data

  let player: Player | undefined = undefined
  $: duration = player ? player.getDuration() : 1
  let current_time: number = 0
  let playback_rate: number = 1
  let player_state: Player_State = Player_State.UNSTARTED
  let selected_track: Transcript['tracks'][0] | undefined = data.transcript.tracks[3]

  interface Live_Track {
    start_time: number
    end_time: number
    start_index: number
    end_index: number
    data: Track_Datum[]
  }

  const update_live_track = (options: {
    track_data: Track_Datum[]
    previous_state: Live_Track
    updated_time: number
  }) => {
    const start_time = Math.max(0, options.updated_time - 2)
    const end_time = options.updated_time + 2

    const previous_datums = options.track_data.slice(options.previous_state.start_index)
    const start_index = previous_datums.findIndex((datum) => datum.start >= start_time)
    const next_datums = options.track_data.slice(options.previous_state.end_index + 1)
    const end_index = next_datums.findLastIndex((datum) => datum.end <= end_time)
    const data = options.track_data.slice(start_index, end_index + 1)

    return {
      start_time,
      end_time,
      start_index,
      end_index,
      data,
    }
  }
  let live_track = update_live_track({
    track_data: selected_track ? selected_track.data : [],
    previous_state: {
      end_index: 0,
      start_index: 0,
      end_time: 0,
      start_time: 0,
      data: [],
    },
    updated_time: 0,
  })

  let do_tick = false
  onMount(async () => {
    if (data.type !== 'youtube') {
      return
    }

    player = await window.get_youtube_player(data.video_id)
    player.unloadModule('captions')

    const tick_once = (player: Player) => {
      current_time = player.getCurrentTime()
      playback_rate = player.getPlaybackRate()
    }

    const tick = (player: Player) => {
      if (!do_tick) {
        return
      }

      tick_once(player)

      window.requestAnimationFrame(() => {
        tick(player)
      })
    }

    const on_state_change = (event: State_Change_Event) => {
      player_state = event.data
      const player = event.target

      switch (event.data) {
        case window.YT.PlayerState.PLAYING:
          // enable ticks
          do_tick = true

          tick_once(player)
          tick(player)

          return

        case window.YT.PlayerState.PAUSED:
        case window.YT.PlayerState.ENDED:
        case window.YT.PlayerState.BUFFERING:
          do_tick = false
          tick_once(player)

          return
      }
    }
    player.addEventListener('onStateChange', on_state_change)

    player.hideVideoInfo()
  })

  onDestroy(() => {
    do_tick = false
  })

  const embedding_search_params = new URLSearchParams({
    enablejsapi: '1',
    origin: $page.url.origin,
    color: 'white',
    iv_load_policy: '3',
    playsinline: '1',
    rel: '0',
    controls: '0',
    disablekb: '1 ',
    cc_load_policy: '0',
    fs: '0',
  })
</script>

<h1 class="page_title @heading +1 @content">{data.title}</h1>

{#if data.type === 'youtube'}
  <iframe
    id={data.video_id}
    width="560"
    height="315"
    src="https://www.youtube-nocookie.com/embed/{data.video_id}?{embedding_search_params.toString()}"
    title={data.title}
    frameborder="0"
    allow="autoplay; encrypted-media; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    class="video @content +no_minimum"
  />
{/if}

{#if selected_track}
  <Transcript_Editor
    {current_time}
    {duration}
    track_data={selected_track.data}
    on:seek_to={(event) => {
      if (!player) {
        return
      }

      player.seekTo(event.detail)
      current_time = event.detail
    }}
  />
{/if}

<div
  role="presentation"
  class="player_controls @content +no_minimum"
>
  <button
    disabled={!player || player_state === Player_State.BUFFERING}
    on:click={() => {
      if (!player) {
        return
      }

      if (player_state === Player_State.BUFFERING) {
        return
      }

      if (player_state === Player_State.PLAYING) {
        return player.pauseVideo()
      }

      return player.playVideo()
    }}
    class="@button +square"
  >
    {#if !player || player_state === Player_State.BUFFERING}
      <span
        aria-hidden="true"
        class="loading_icon active"
      >
        <Loading aria-label="Loading video" />
      </span>
    {:else if player_state === Player_State.PLAYING}
      <Pause aria-label="Pause" />
    {:else}
      <Play aria-label="Play" />
    {/if}
  </button>

  <select
    bind:value={playback_rate}
    on:input={(event) => {
      if (!player) {
        return
      }

      const playback_rate = parseFloat(event.currentTarget.value)

      player.setPlaybackRate(playback_rate)
    }}
    class="@input"
  >
    {#if !player}
      <option value={playback_rate}>{playback_rate}x</option>
    {:else}
      {#each player.getAvailablePlaybackRates() as playback_rate}
        <option value={playback_rate}>{playback_rate}x</option>
      {/each}
    {/if}
  </select>

  {#if data.transcript.tracks.length > 1}
    <select
      class="@input"
      bind:value={selected_track}
    >
      {#each data.transcript.tracks as track}
        <option value={track}>{track.title}</option>
      {/each}
    </select>
  {/if}
</div>

<svelte:head>
  <script>
    // add the youtube api readiness callback which sets the window flag
    window.onYouTubeIframeAPIReady = () => {
      window.is_youtube_api_ready = true
    }

    // add the youtube player getter
    window.get_youtube_player = async (id) => {
      // wait for the api to be ready if not ready yet
      if (!window.is_youtube_api_ready) {
        const is_youtube_api_ready_promise = new Promise((resolve) => {
          // resolve the promise when the api is ready (and set the flag like before)
          window.onYouTubeIframeAPIReady = () => {
            window.is_youtube_api_ready = true
            resolve()
          }
        })

        // wait.
        await is_youtube_api_ready_promise
      }

      // wait for the player to be ready before returning it
      const player_promise = new Promise((resolve) => {
        const player = new window.YT.Player(id, {
          events: {
            onReady: () => {
              resolve(player)
            },
          },
        })
      })

      return player_promise
    }
  </script>
  <script src="https://www.youtube.com/iframe_api"></script>
</svelte:head>

<style>
  .page_title {
    margin-top: 4rem;
  }

  .video {
    margin-top: 2rem;
    aspect-ratio: 560 / 315;
    width: calc(100% - var(--margin) * 2);
    height: auto;
  }

  .player_controls {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-auto-flow: column;
    justify-content: start;
    align-items: center;
    justify-items: start;
    gap: 1rem;
    margin-top: 0.5rem;
    margin-inline: calc(var(--margin) + 0.5rem);
    border-radius: 0.25rem;
  }

  @keyframes loading {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .loading_icon {
    display: grid;
    place-content: center;
    animation-duration: 1s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-fill-mode: backwards;
    animation-play-state: playing;
    animation-name: loading;
    transition-duration: 100ms;
    transition-property: opacity;
    transition-timing-function: ease-in;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    color: var(--color-red-3);
  }
</style>
