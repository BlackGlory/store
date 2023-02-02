import { getDatabase } from '@dao/config/database.js'

interface IRawJSONSchema {
  namespace: string
  json_schema: string
}

export function setRawJSONSchema(item: IRawJSONSchema): IRawJSONSchema {
  getDatabase().prepare(`
    INSERT INTO store_json_schema (namespace, json_schema)
    VALUES ($namespace, $json_schema);
  `).run(item)

  return item
}

export function hasRawJSONSchema(namespace: string): boolean {
  return !!getRawJSONSchema(namespace)
}

export function getRawJSONSchema(namespace: string): IRawJSONSchema | null {
  return getDatabase().prepare(`
    SELECT *
      FROM store_json_schema
     WHERE namespace = $namespace;
  `).get({ namespace })
}
