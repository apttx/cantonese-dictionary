export interface Phrase {
  id: string
  english: string
  jyutping: string
  pinyin: string
  traditional: string
  simplified: string
  senses: Phrase[]
}
