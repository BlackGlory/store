import { getDatabase } from '@dao/config-in-sqlite3/database'

interface IRawJsonSchema {
  store_id: string
  json_schema: string
}

export function setRawJsonSchema(props: IRawJsonSchema): void {
  getDatabase().prepare(`
    INSERT INTO store_json_schema (store_id, json_schema)
    VALUES ($store_id, $json_schema);
  `).run(props)
}

export function hasRawJsonSchema(id: string): boolean {
  return !!getRawJsonSchema(id)
}

export function getRawJsonSchema(id: string): IRawJsonSchema | null {
  return getDatabase().prepare(`
    SELECT *
      FROM store_json_schema
     WHERE store_id = $id;
  `).get({ id })
}
