import {
  getDatabase as getAccessControlDatabase
, reconnectDatabase as reconnectAccessControlDatabase
, migrateDatabase as migrateAccessControlDatabase
} from '@dao/access-control/database'
import {
  getDatabase as getJsonSchemaDatabase
, reconnectDatabase as reconnectJsonSchemaDatabase
, migrateDatabase as migrateJsonSchemaDatabase
} from '@dao/json-schema/database'

export async function prepareDatabase() {
  await prepareAccessControlDatabase()
  await prepareJsonSchemaDatabase()
}

export async function prepareAccessControlDatabase() {
  reconnectAccessControlDatabase()
  const db = getAccessControlDatabase()
  await migrateAccessControlDatabase()
  return db
}

export async function prepareJsonSchemaDatabase() {
  reconnectJsonSchemaDatabase()
  const db = getJsonSchemaDatabase()
  await migrateJsonSchemaDatabase()
  return db
}

export async function resetEnvironment() {
  // assigning a property on `process.env` will implicitly convert the value to a string.
  // use `delete` to delete a property from `process.env`.
  // sjee also: https://nodejs.org/api/process.html#process_process_env
  delete process.env.STORE_HOST
  delete process.env.STORE_PORT
  delete process.env.STORE_ADMIN_PASSWORD
  delete process.env.STORE_LIST_BASED_ACCESS_CONTROL
  delete process.env.STORE_TOKEN_BASED_ACCESS_CONTROL
  delete process.env.STORE_WRITE_TOKEN_REQUIRED
  delete process.env.STORE_READ_TOKEN_REQUIRED
  delete process.env.STORE_DELETE_TOKEN_REQUIRED
  delete process.env.STORE_JSON_VALIDATION
  delete process.env.STORE_DEFAULT_JSON_SCHEMA
  delete process.env.STORE_JSON_PAYLOAD_ONLY
}
