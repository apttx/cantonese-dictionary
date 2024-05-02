export enum Player_State {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5,
}

export interface State_Change_Event {
  target: Player
  data: Player_State
}

export interface Player_Options {
  events?: {
    onReady?: (event: { target: Player; data: null }) => void
    onStateChange?: (event: State_Change_Event) => void
  }
}

interface Event_Map {
  onStateChange: {
    target: Player
    data: Player_State
  }
}

export class Player {
  constructor(id: string, options?: Player_Options)

  public getCurrentTime(): number
  public playVideo(): void
  public pauseVideo(): void
  public setVolume(volume: number): void
  public addEventListener<Event extends keyof Event_Map>(
    event: Event,
    listener: (event: Event_Map[Event]) => void,
  )
  public getAvailablePlaybackRates(): number[]
  public setPlaybackRate(number: 0.25 | 0.5 | 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2): void
  public setPlaybackRate(number: number): void
  public getPlaybackRate(): number
  public hideVideoInfo(): void
  public seekTo(time: number): void
  public getDuration(): number
  public unloadModule(module: 'captions'): Player
}

export interface YT {
  Player: typeof Player
  PlayerState: {
    UNSTARTED: Player_State.UNSTARTED
    ENDED: Player_State.ENDED
    PLAYING: Player_State.PLAYING
    PAUSED: Player_State.PAUSED
    BUFFERING: Player_State.BUFFERING
    CUED: Player_State.CUED
  }
}
