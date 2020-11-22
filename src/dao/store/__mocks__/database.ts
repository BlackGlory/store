import levelup, { LevelUp } from 'levelup'
import memdown from 'memdown'
import encode from 'encoding-down'

let db: LevelUp

export function getDatabase() {
  return db
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
