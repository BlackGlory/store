import Database = require('better-sqlite3')
import type { Database as IDatabase } from 'better-sqlite3'
import { migrateDatabase } from '../utils'
import { assert } from '@blackglory/errors'

let db: IDatabase

export function openDatabase(): void {
  db = new Database(':memory:')
}

export async function prepareDatabase(): Promise<void> {
  assert(db)
  await migrateDatabase(db)
}

export function getDatabase(): IDatabase {
  assert(db)
  return db
}

export function closeDatabase() {
  if (db) db.close()
}
