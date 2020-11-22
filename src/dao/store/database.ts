import * as path from 'path'
import * as fs from 'fs-extra'
import { path as appRoot } from 'app-root-path'
import levelup, { LevelUp } from 'levelup'
import leveldown from 'leveldown'
import { NODE_ENV, NodeEnv } from '@env'
import { strict as assert } from 'assert'
assert(NODE_ENV() !== NodeEnv.Test)

let db: LevelUp

export function getDatabase() {
  return db
}

export async function closeDatabase() {
  if (db) await db.close()
}

export async function prepareDatabase()  {
  db = connectDatabase()
}

function connectDatabase() {
  const dataPath = path.join(appRoot, 'data/store')
  fs.ensureDirSync(dataPath)

  return levelup(leveldown(dataPath))
}
