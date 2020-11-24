import levelup, { LevelUp } from 'levelup'
import memdown from 'memdown'
import encode from 'encoding-down'
import sub = require('subleveldown')

let db: LevelUp

export function getDatabase() {
  return db
}

export function getSubDatabase(namespace: string) {
  // `sub` will always overwrite the encoding options of db,
  // so we need to reset encoding here.
  return sub(getDatabase(), namespace, { valueEncoding: 'json' })
}

export async function closeDatabase() {
  if (db) await db.close()
}

export async function prepareDatabase() {
  db = connectDatabase()
}

function connectDatabase() {
  return levelup(encode(memdown()))
}
