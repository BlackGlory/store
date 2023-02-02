import { getDatabase } from '../database.js'

export function getAllNamespacesWithJSONSchema(): string[] {
  const result = getDatabase().prepare(`
    SELECT namespace
      FROM store_json_schema
  `).all() as Array<{ namespace: string }>

  return result.map(x => x['namespace'])
}

export function getJSONSchema(namespace: string): string | null {
  const result = getDatabase().prepare(`
    SELECT json_schema
      FROM store_json_schema
     WHERE namespace = $namespace;
  `).get({ namespace }) as { json_schema: string } | undefined

  return result ? result['json_schema'] : null
}

export function setJSONSchema({ namespace, schema }: { namespace: string; schema: string }): void {
  getDatabase().prepare(`
    INSERT INTO store_json_schema (namespace, json_schema)
    VALUES ($namespace, $schema)
        ON CONFLICT(namespace)
        DO UPDATE SET json_schema = $schema;
  `).run({ namespace, schema })
}

export function removeJSONSchema(namespace: string): void {
  getDatabase().prepare(`
    DELETE FROM store_json_schema
     WHERE namespace = $namespace;
  `).run({ namespace })
}
