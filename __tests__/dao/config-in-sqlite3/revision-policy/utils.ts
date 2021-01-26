import { getDatabase } from '@dao/config-in-sqlite3/database'

interface IRawRevisionPolicy {
  store_id: string
  update_revision_required: number | null
  delete_revision_required: number | null
}

export function setRawRevisionPolicy(props: IRawRevisionPolicy): void {
  getDatabase().prepare(`
    INSERT INTO store_revision_policy (
      store_id
    , update_revision_required
    , delete_revision_required
    )
    VALUES (
      $store_id
    , $update_revision_required
    , $delete_revision_required
    );
  `).run(props)
}

export function hasRawRevisionPolicy(id: string): boolean {
  return !!getRawRevisionPolicy(id)
}

export function getRawRevisionPolicy(id: string): IRawRevisionPolicy | null {
  return getDatabase().prepare(`
    SELECT *
      FROM store_revision_policy
     WHERE store_id = $id;
  `).get({ id })
}
