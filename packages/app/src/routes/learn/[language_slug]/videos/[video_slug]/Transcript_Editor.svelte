<script lang="ts">
  import type { Track_Datum } from '$modules/transcript'
  import { createEventDispatcher } from 'svelte'
  import type { ActionReturn } from 'svelte/action'
  import Change_Start_Time from '~icons/mingcute/arrow-to-left-line'
  import Change_End_Time from '~icons/mingcute/arrow-to-right-line'

  const dispatch = createEventDispatcher<{ seek_to: number }>()

  export let current_time: number
  export let duration: number
  export let track_data: Track_Datum[]
  let selected_datum: Track_Datum | null = null
  let timeline_scale = 25
  let timeline_element: HTMLDivElement

  const change_timeline_scale = (scale: number) => {
    const computed_timeline_style = getComputedStyle(timeline_element)
    const padding = parseInt(computed_timeline_style.paddingLeft)
    const center_offset = timeline_element.offsetWidth / 2 - padding
    const scale_ratio = scale / timeline_scale
    const current_scroll = timeline_element.scrollLeft + center_offset
    const new_scroll = current_scroll * scale_ratio - center_offset

    timeline_element.scrollLeft = new_scroll
    timeline_scale = scale
  }

  const drag = (
    element: HTMLElement,
    options?: { on_drag?: (drag: { x: number; y: number }) => void },
  ): ActionReturn => {
    let mouse_down = false

    const on_mouse_down = (event: MouseEvent) => {
      const composed_path = event.composedPath()
      const composed_path_contains_draggable = composed_path.includes(element)

      if (!composed_path_contains_draggable) {
        return
      }

      mouse_down = true
    }

    const on_mouse_move = (event: MouseEvent) => {
      if (!mouse_down) {
        return
      }

      const { x, y } = event

      options?.on_drag?.({ x, y })
    }

    const on_mouse_up = (event: MouseEvent) => {
      mouse_down = false
    }

    window.addEventListener('mousedown', on_mouse_down)
    window.addEventListener('mousemove', on_mouse_move)
    window.addEventListener('mouseup', on_mouse_up)

    return {
      destroy: () => {
        window.removeEventListener('mousedown', on_mouse_down)
        window.removeEventListener('mousemove', on_mouse_move)
        window.removeEventListener('mouseup', on_mouse_up)
      },
    }
  }
</script>

<div
  role="presentation"
  bind:this={timeline_element}
  class="timeline @content"
>
  <input
    type="range"
    min="0"
    max={duration}
    step="0.01"
    bind:value={current_time}
    on:input={(event) => {
      const time = parseFloat(event.currentTarget.value)

      dispatch('seek_to', time)
    }}
    class="time_input"
    style:--width="{duration * timeline_scale}rem"
  />

  <div
    role="presentation"
    class="buttons"
  >
    {#each track_data as datum, index}
      {@const previous_datum = track_data[index - 1]}
      {@const previous_end = previous_datum ? previous_datum.end : 0}
      {@const next_datum = track_data[index + 1]}
      {@const next_start = next_datum ? next_datum.start : Infinity}
      {@const distance_to_previous = datum.start - previous_end}
      {@const is_selected = datum === selected_datum}
      <div
        class="transcriptor_button"
        class:selected_datum={is_selected}
        style:--width="{(datum.end - datum.start) * timeline_scale}rem"
        style:--margin-left="{distance_to_previous * timeline_scale}rem"
      >
        {#if is_selected}
          <button
            use:drag={{
              on_drag: (drag) => {
                const timeline_client_rectangle = timeline_element.getBoundingClientRect()
                const computed_timeline_style = getComputedStyle(timeline_element)
                const padding = parseInt(computed_timeline_style.paddingLeft)
                const x = timeline_element.scrollLeft + drag.x
                const left = timeline_client_rectangle.left + padding
                const time = (x - left) / timeline_scale / 16

                const clamped_time = Math.max(Math.min(datum.end - 0.05, time), previous_end)

                datum.start = clamped_time
              },
            }}
            class="start_change_button"
          >
            <Change_Start_Time
              aria-label="Drag to change start time"
              height="2rem"
            />
            {datum.start.toFixed(2)}s
          </button>

          <span class="selected_datum_text">
            {datum.text}
          </span>

          <button
            use:drag={{
              on_drag: (drag) => {
                const timeline_client_rectangle = timeline_element.getBoundingClientRect()
                const computed_timeline_style = getComputedStyle(timeline_element)
                const padding = parseInt(computed_timeline_style.paddingLeft)
                const x = timeline_element.scrollLeft + drag.x
                const left = timeline_client_rectangle.left + padding
                const time = (x - left) / timeline_scale / 16

                const clamped_time = Math.min(Math.max(datum.start + 0.05, time), next_start)

                datum.end = clamped_time
              },
            }}
            class="end_change_button"
          >
            {datum.end.toFixed(2)}s
            <Change_End_Time
              aria-label="Drag to change end time"
              height="2rem"
            />
          </button>
        {:else}
          <button
            class="idle_datum_button"
            on:click={() => {
              selected_datum = datum
            }}
          >
            {datum.text}
          </button>
        {/if}
      </div>
    {/each}
  </div>
</div>

<div
  role="presentation"
  class="controls @content +no_minimum"
>
  <input
    type="range"
    min="1"
    max="50"
    step="1"
    value={timeline_scale}
    on:input={(event) => {
      const new_timeline_scale = parseInt(event.currentTarget.value)

      change_timeline_scale(new_timeline_scale)
    }}
    class="scale_input"
  />
</div>

<style>
  .timeline {
    margin: 0;
    padding-inline: var(--margin);
    padding-bottom: 2rem;
    overflow-x: auto;
  }

  .time_input {
    width: var(--width);
  }

  .buttons {
    display: flex;
  }

  .transcriptor_button {
    display: block;
    flex: 0 0 var(--width);
    float: left;
    margin-left: var(--margin-left);
    border-right-color: var(--color-purple-4);
    border-left-color: var(--color-purple-2);
    border-radius: 0.25rem;
    border-inline-width: 0.25rem;
    background-color: var(--color-purple-1);
    width: var(--width);
  }

  .selected_datum {
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-areas:
      'start_change . end_change'
      'text text text';
    background-color: var(--color-purple-3);
    color: white;
  }

  .idle_datum_button {
    padding-inline: 1rem;
    padding-block: 0.5rem;
    width: 100%;
    height: 100%;
  }

  .selected_datum_text {
    display: inline-block;
    grid-area: text;
    padding-inline: 1rem;
    padding-block: 0.5rem;
  }

  .start_change_button {
    display: inline-block;
    grid-area: start_change;
    cursor: ew-resize;
    padding-right: 1rem;
    padding-block: 0.5rem;
  }

  .end_change_button {
    display: inline-block;
    grid-area: end_change;
    cursor: ew-resize;
    padding-left: 1rem;
    padding-block: 0.5rem;
  }

  .controls {
    position: relative;
    grid-auto-flow: column;
    justify-content: start;
    align-items: center;
    justify-items: start;
    gap: 1rem;
    margin-inline: calc(var(--margin) + 0.5rem);
    overflow-x: auto;
  }
</style>
