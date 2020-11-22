import { getDatabase } from '../database'
import sub = require('subleveldown')

export function getSubDatabase(namespace: string) {
  // `sub` will always overwrite the encoding options of db,
  // so we need to reset encoding here.
  return sub(getDatabase(), namespace, { valueEncoding: 'json' })
}
