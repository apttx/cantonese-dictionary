import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

/** @type {(data_directory: string) => Hanzi_Datasource} */
export const get_hanzi_datasource = (data_directory) => {
  /** @param {string} text */
  const from_text = async (text) => {
    const promises = Array.from(text).map(async (character) => {
      let animated_svg_string
      try {
        const character_code = character.charCodeAt(0)
        const file_name = `${character_code}.svg`
        const file_path = join(data_directory, file_name)
        const file_buffer = await readFile(file_path)
        const file_string = file_buffer.toString()
        const file_string_with_fixed_keyframes = file_string
          .replace(/keyframes(\d+)/g, `keyframes_${character_code}_$1`)
          .replace(
            /make-me-a-hanzi-(clip|animation)-(\d+)/g,
            `make-me-a-hanzi_${character_code}_$1-$2`,
          )
        animated_svg_string = file_string_with_fixed_keyframes
      } catch {
        /* emtpy block statement */
      }

      const graphics = { animated_svg_string }

      /** @type {Hanzi} */
      const hanzi = {
        character,
        graphics,
      }

      return hanzi
    })
    const hanzis = await Promise.all(promises)

    return hanzis
  }

  const hanzi = {
    from_text,
  }

  return hanzi
}
