export interface Track_Datum {
  start: number
  end: number
  text: string
}

export interface Transcript {
  tracks: {
    title: string
    data: Track_Datum[]
  }[]
}
