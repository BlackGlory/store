import * as AccessControlDatatbase from '@dao/access-control/database'
import * as JsonSchemaDatabase from '@dao/json-schema/database'
import * as StoreDatabase from '@dao/store/database'

export async function resetDatabases() {
  await resetAccessControlDatabase()
  await resetJsonSchemaDatabase()
  await resetStoreDatabase()
}

export async function resetAccessControlDatabase() {
  AccessControlDatatbase.closeDatabase()
  await AccessControlDatatbase.prepareDatabase()
}

export async function resetJsonSchemaDatabase() {
  JsonSchemaDatabase.closeDatabase()
  await JsonSchemaDatabase.prepareDatabase()
}

export async function resetStoreDatabase() {
  await StoreDatabase.closeDatabase()
  await StoreDatabase.prepareDatabase()
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
