import type { TransitionConfig } from 'svelte/transition'

export const flip = (
  _: Element,
  config: {
    delay?: number
    duration?: number
    easing?: import('svelte/transition').EasingFunction
  },
): TransitionConfig => {
  const { delay, duration, easing } = config
  const css = (_: number, u: number) => `transform: rotateY(${u * 90}deg)`

  return {
    delay,
    duration,
    easing,
    css,
  }
}
