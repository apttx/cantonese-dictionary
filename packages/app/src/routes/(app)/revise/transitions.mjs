/**
 * @type {(
 *   element: Element,
 *   config: {
 *     delay?: number
 *     duration?: number
 *     easing?: import('svelte/transition').EasingFunction
 *   },
 * ) => {
 *   delay?: number
 *   duration?: number
 *   easing?: import('svelte/transition').EasingFunction
 *   css: (t: number, u: number) => string
 * }}
 */
export const flip = (_, config) => {
  const { delay, duration, easing } = config
  /** @type {(t: number, u: number) => string} */
  const css = (_, u) => `transform: rotateY(${u * 90}deg)`

  return {
    delay,
    duration,
    easing,
    css,
  }
}
