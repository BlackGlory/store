import Database = require('better-sqlite3')
import { path as appRoot } from 'app-root-path'
import * as path from 'path'
import * as fs from 'fs-extra'
import { readMigrations } from 'migrations-file'
import { migrate } from '@blackglory/better-sqlite3-migrations'

const migrationsPath = path.join(appRoot, 'migrations/json-schema')
const dataPath = path.join(appRoot, 'data')
const dataFilename = path.join(dataPath, 'json-schema.db')
fs.ensureDirSync(dataPath)
let db = new Database(dataFilename)

export function getDatabase() {
  if (!db.open) reconnectDatabase()
  return db
}

export function reconnectDatabase() {
  db.close()
  db = new Database(dataFilename)
}

export async function migrateDatabase() {
  const migrations = await readMigrations(migrationsPath)
  migrate(db, migrations)
}
