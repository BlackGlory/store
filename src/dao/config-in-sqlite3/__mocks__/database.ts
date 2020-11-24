import * as path from 'path'
import { path as appRoot } from 'app-root-path'
import { readMigrations } from 'migrations-file'
import { migrate } from '@blackglory/better-sqlite3-migrations'
import Database = require('better-sqlite3')
import type { Database as IDatabase } from 'better-sqlite3'

let db: IDatabase

export function getDatabase() {
  return db
}

export function closeDatabase() {
  if (db) db.close()
}

export async function prepareDatabase() {
  db = connectDatabase()
  await migrateDatabase(db)
}

function connectDatabase(): IDatabase {
  return new Database(':memory:')
}

async function migrateDatabase(db: IDatabase) {
  const migrationsPath = path.join(appRoot, 'migrations/config-in-sqlite3')
  const migrations = await readMigrations(migrationsPath)
  migrate(db, migrations)
}
