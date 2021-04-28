import { getDatabase } from '@dao/config-in-sqlite3/database'

interface IRawJsonSchema {
  namespace: string
  json_schema: string
}

export function setRawJsonSchema(item: IRawJsonSchema): IRawJsonSchema {
  getDatabase().prepare(`
    INSERT INTO store_json_schema (namespace, json_schema)
    VALUES ($namespace, $json_schema);
  `).run(item)

  return item
}

export function hasRawJsonSchema(namespace: string): boolean {
  return !!getRawJsonSchema(namespace)
}

export function getRawJsonSchema(namespace: string): IRawJsonSchema | null {
  return getDatabase().prepare(`
    SELECT *
      FROM store_json_schema
     WHERE namespace = $namespace;
  `).get({ namespace })
}
