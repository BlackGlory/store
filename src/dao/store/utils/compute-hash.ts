import * as crypto from 'crypto'

export function computeHash(text: string): string {
  const hash = crypto.createHash('sha256')
  hash.update(text, )
  return hash.digest('hex')
}
