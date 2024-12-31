import { randomBytes } from 'node:crypto'

export const load = () => {
  const challenge = randomBytes(32).toString('base64')
  const user_id = randomBytes(32).toString('base64')

  return {
    challenge,
    user_id,
  }
}
