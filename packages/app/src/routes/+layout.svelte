<script>
  import '@fontsource/dm-sans/400.css'
  import '@fontsource/dm-sans/500.css'
  import '@fontsource/dm-sans/700.css'

  import '@unocss/reset/tailwind.css'
</script>

<slot />

<style>
  :global(:root) {
    /** Import string:
 * [{"name":"red","lightness":{"name":"linear","start":0,"end":1,"min":0.2,"max":0.9},"chroma":{"name":"sine","start":0.2,"end":0.8,"min":0.1,"max":0.2},"hue":{"name":"linear","start":0,"end":1,"min":23.5,"max":23.5},"count":5}]
 */

    --color-red-1: oklch(90% 0.1 23.5);
    --color-red-2: oklch(72.5% 0.1685 23.5);
    --color-red-3: oklch(55% 0.2 23.5);
    --color-red-4: oklch(37.5% 0.1685 23.5);
    --color-red-5: oklch(20% 0.1 23.5);
  }

  :global(:root) {
    /** Import string:
 * [{"name":"neutral","lightness":{"name":"linear","start":0,"end":1,"min":0.2,"max":0.9},"chroma":{"name":"sine","start":0.2,"end":0.8,"min":0,"max":0},"hue":{"name":"linear","start":0,"end":1,"min":23.5,"max":23.5},"count":5}]
 */

    --color-neutral-1: oklch(90% 0 23.5);
    --color-neutral-2: oklch(72.5% 0 23.5);
    --color-neutral-3: oklch(55% 0 23.5);
    --color-neutral-4: oklch(37.5% 0 23.5);
    --color-neutral-5: oklch(20% 0 23.5);
  }

  :global(:root) {
/** Import string:
 * [{"name":"orange","lightness":{"name":"linear","start":0,"end":1,"min":0.2,"max":0.9},"chroma":{"name":"sine","start":0.2,"end":0.8,"min":0.1,"max":0.2},"hue":{"name":"linear","start":0,"end":1,"min":45,"max":45},"count":5}]
 */

    --color-orange-1: oklch(90% 0.1 45);
    --color-orange-2: oklch(72.5% 0.1685 45);
    --color-orange-3: oklch(55% 0.2 45);
    --color-orange-4: oklch(37.5% 0.1685 45);
    --color-orange-5: oklch(20% 0.1 45);
}

  :global(:root) {
/** Import string:
 * [{"name":"blue","lightness":{"name":"linear","start":0,"end":1,"min":0.2,"max":0.9},"chroma":{"name":"sine","start":0.2,"end":0.8,"min":0.1,"max":0.2},"hue":{"name":"linear","start":0,"end":1,"min":250,"max":250},"count":5}]
 */

    --color-blue-1: oklch(90% 0.1 250);
    --color-blue-2: oklch(72.5% 0.1685 250);
    --color-blue-3: oklch(55% 0.2 250);
    --color-blue-4: oklch(37.5% 0.1685 250);
    --color-blue-5: oklch(20% 0.1 250);
  }

  :global(:root) {
/** Import string:
 * [{"name":"purple","lightness":{"name":"linear","start":0,"end":1,"min":0.2,"max":0.9},"chroma":{"name":"sine","start":0.2,"end":0.8,"min":0.1,"max":0.2},"hue":{"name":"linear","start":0,"end":1,"min":290.2,"max":290.2},"count":5}]
 */

    --color-purple-1: oklch(90% 0.1 290.2);
    --color-purple-2: oklch(72.5% 0.1685 290.2);
    --color-purple-3: oklch(55% 0.2 290.2);
    --color-purple-4: oklch(37.5% 0.1685 290.2);
    --color-purple-5: oklch(20% 0.1 290.2);
  }

  :global(:root),
  :global(html),
  :global(body) {
    font-family: 'DM Sans', sans-serif;
  }

  :global(:root) {
    /* base */
    --bg_base: #ffffff;

    --text_primary_onbase: var(--color-red-3);
    --text_primary-faint_onbase: var(--color-red-1);
    --text_primary-subtle_onbase: var(--color-red-2);
    --text_primary-strong_onbase: var(--color-red-4);

    --text_neutral_onbase: var(--color-neutral-5);
    --text_neutral-faint_onbase: var(--color-neutral-1);
    --text_neutral-subtle_onbase: var(--color-neutral-3);

    --text_brand-3_onbase: var(--color-purple-3);
    --text_brand-3-faint_onbase: var(--color-purple-1);
    --text_brand-3-subtle_onbase: var(--color-purple-2);

    /* primary */
    --bg_primary: var(--color-red-3);
    --text_neutral_onprimary: var(--color-neutral-1);

    --bg_primary-strong: var(--color-red-5);

    /** secondary */
    --bg_brand-3: var(--color-purple-3);
    
    --margin_screen-borders: 1rem;
    --width_text: 32rem;
    --width_page: 48rem;
    --width_layout: 100rem;

    --margin_content_text: clamp(var(--margin_screen-borders), 100%, 50% - var(--width_text) / 2);
    --margin_content_page: clamp(var(--margin_screen-borders), 100%, 50% - var(--width_page) / 2);
    --margin_content_layout: clamp(var(--margin_screen-borders), 100%, 50% - var(--width_layout) / 2);

    --height_header: 4rem;
  }

  :global(.cd_button) {
    transition-duration: 150ms;
    transition-property: color;
    transition-timing-function: ease-in;
  }
  :global(.cd_button:hover) {
    transition-timing-function: ease-out;
    color: var(--text_primary_onbase);
  }

  :global(.cd_link) {
    transition-duration: 150ms;
    transition-property: color;
    transition-timing-function: ease-in;
    color: var(--text_primary_onbase);
    text-decoration: underline;
    text-decoration: underline;
    text-decoration-thickness: 0.1em;
    text-underline-offset: 0.25em;
    font-weight: 500;
  }
  :global(.cd_link:hover) {
    transition-timing-function: ease-out;
    color: var(--text_primary-strong_onbase);
  }

  :global(.container_text) {
    display: block;
    margin-inline: clamp(var(--margin_screen-borders), 100%, 50% - var(--width_text) / 2);
    width: auto;
    max-width: var(--width_text);
  }

  :global(.container_page) {
    display: block;
    margin-inline: clamp(var(--margin_screen-borders), 100%, 50% - var(--width_page) / 2);
    width: auto;
    max-width: var(--width_page);
  }

  :global(.container_layout) {
    display: block;
    margin-inline: clamp(var(--margin_screen-borders), 100%, 50% - var(--width_layout) / 2);
    width: auto;
    max-width: var(--width_layout);
  }
</style>

