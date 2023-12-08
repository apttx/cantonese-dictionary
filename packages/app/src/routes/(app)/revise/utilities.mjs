/** @type {<Type extends unknown = never>(items: Type[]) => Type} */
export const get_random = (items) => {
  let random_index = Math.floor(Math.random() * items.length)

  const random_item = items[random_index]

  return random_item
}
