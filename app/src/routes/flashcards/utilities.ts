export const get_random = <Type = never>(items: Type[]): Type => {
  const random_index = Math.floor(Math.random() * items.length)

  const random_item = items[random_index]

  return random_item
}
