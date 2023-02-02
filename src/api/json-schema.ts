import Ajv from 'ajv'
import { JSONSchemaDAO } from '@dao/index.js'
import { DEFAULT_JSON_SCHEMA } from '@env/index.js'
import { JSON_VALIDATION } from '@env/index.js'
import { JSONValue } from '@blackglory/prelude'
import { CustomError } from '@blackglory/errors'
import { getErrorResult } from 'return-style'

// @ts-ignore
const ajv = new Ajv()

export function isEnabled(): boolean {
  return JSON_VALIDATION()
}

export function getAllNamespaces(): string[] {
  return JSONSchemaDAO.getAllNamespacesWithJSONSchema()
}

export function get(namespace: string): string | null {
  return JSONSchemaDAO.getJSONSchema(namespace)
}

export function set(namespace: string, schema: JSONValue): void {
  const schemaString = JSON.stringify(schema, null, 2)
  JSONSchemaDAO.setJSONSchema({ namespace: namespace, schema: schemaString })
}

export function remove(namespace: string): void {
  JSONSchemaDAO.removeJSONSchema(namespace)
}

/**
 * @throws {InvalidPayload}
 */
export function validate(namespace: string, payload: string): void {
  const [err, json] = getErrorResult(() => JSON.parse(payload))
  if (err) throw new InvalidPayload(err.message)

  const jsonSchema= JSONSchemaDAO.getJSONSchema(namespace)
  const schema = jsonSchema ? JSON.parse(jsonSchema) : DEFAULT_JSON_SCHEMA()
  if (schema) {
    const valid = ajv.validate(schema, json)
    if (!valid) throw new InvalidPayload(ajv.errorsText())
  }
}

export class InvalidPayload extends CustomError {}
