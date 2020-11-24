import * as path from 'path'
import * as fs from 'fs-extra'
import { path as appRoot } from 'app-root-path'
import levelup, { LevelUp } from 'levelup'
import leveldown from 'leveldown'
import { NODE_ENV, NodeEnv } from '@env'
import { strict as assert } from 'assert'
import sub = require('subleveldown')
assert(NODE_ENV() !== NodeEnv.Test)

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

export async function prepareDatabase()  {
  db = connectDatabase()
}

function connectDatabase() {
  const dataPath = path.join(appRoot, 'data/leveldb')
  fs.ensureDirSync(dataPath)

  return levelup(leveldown(dataPath))
}
