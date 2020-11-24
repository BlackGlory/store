import { getDatabase } from '../database'

export function getAllIdsWithJsonSchema(): string[] {
  const result = getDatabase().prepare(`
    SELECT store_id FROM store_json_schema
  `).all()
  return result.map(x => x['store_id'])
}

export function getJsonSchema(id: string): string | null {
  const result = getDatabase().prepare(`
    SELECT json_schema FROM store_json_schema
     WHERE store_id = $id;
  `).get({ id })
  if (result) return result['json_schema']
  else return null
}

export function setJsonSchema({ id, schema }: { id: string; schema: string }): void {
  getDatabase().prepare(`
    INSERT INTO store_json_schema (store_id, json_schema)
    VALUES ($id, $schema)
        ON CONFLICT(store_id)
        DO UPDATE SET json_schema = $schema;
  `).run({ id, schema })
}

export function removeJsonSchema(id: string): void {
  getDatabase().prepare(`
    DELETE FROM store_json_schema
     WHERE store_id = $id;
  `).run({ id })
}
