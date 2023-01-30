import { getDatabase } from '@dao/config-in-sqlite3/database.js'

interface IRawRevisionPolicy {
  namespace: string
  update_revision_required: number | null
  delete_revision_required: number | null
}

export function setRawRevisionPolicy<T extends IRawRevisionPolicy>(item: T): T {
  getDatabase().prepare(`
    INSERT INTO store_revision_policy (
      namespace
    , update_revision_required
    , delete_revision_required
    )
    VALUES (
      $namespace
    , $update_revision_required
    , $delete_revision_required
    );
  `).run(item)

  return item
}

export function hasRawRevisionPolicy(namespace: string): boolean {
  return !!getRawRevisionPolicy(namespace)
}

export function getRawRevisionPolicy(namespace: string): IRawRevisionPolicy | null {
  return getDatabase().prepare(`
    SELECT *
      FROM store_revision_policy
     WHERE namespace = $namespace;
  `).get({ namespace })
}
