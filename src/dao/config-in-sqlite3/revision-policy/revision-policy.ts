import { getDatabase } from '../database'

export function getAllIdsWithRevisionPolicies(): string[] {
  const result = getDatabase().prepare(`
    SELECT store_id
      FROM store_revision_policy;
  `).all()
  return result.map(x => x['store_id'])
}

export function getRevisionPolicies(id: string): {
  updateRevisionRequired: boolean | null
  deleteRevisionRequired: boolean | null
} {
  const row: {
    'update_revision_required': number | null
  , 'delete_revision_required': number | null
  } = getDatabase().prepare(`
    SELECT update_revision_required
         , delete_revision_required
      FROM store_revision_policy
     WHERE store_id = $id;
  `).get({ id })
  if (row) {
    const updateRevisionRequired = row['update_revision_required']
    const deleteRevisionRequired = row['delete_revision_required']
    return {
      updateRevisionRequired:
        updateRevisionRequired === null
        ? null
        : numberToBoolean(updateRevisionRequired)
    , deleteRevisionRequired:
        deleteRevisionRequired === null
        ? null
        : numberToBoolean(deleteRevisionRequired)
    }
  } else {
    return {
      updateRevisionRequired: null
    , deleteRevisionRequired: null
    }
  }
}

export function setUpdateRevisionRequired(id: string, val: boolean): void {
  getDatabase().prepare(`
    INSERT INTO store_revision_policy (store_id, update_revision_required)
    VALUES ($id, $updateRevisionRequired)
        ON CONFLICT(store_id)
        DO UPDATE SET update_revision_required = $updateRevisionRequired;
  `).run({ id, updateRevisionRequired: booleanToNumber(val) })
}

export function unsetUpdateRevisionRequired(id: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE store_revision_policy
         SET update_revision_required = NULL
       WHERE store_id = $id;
    `).run({ id })
    deleteNoPoliciesRow(id)
  })()
}

export function setDeleteRevisionRequired(id: string, val: boolean): void {
  getDatabase().prepare(`
    INSERT INTO store_revision_policy (store_id, delete_revision_required)
    VALUES ($id, $deleteRevisionRequired)
        ON CONFLICT(store_id)
        DO UPDATE SET delete_revision_required = $deleteRevisionRequired;
  `).run({ id, deleteRevisionRequired: booleanToNumber(val) })
}

export function unsetDeleteRevisionRequired(id: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE store_revision_policy
         SET delete_revision_required = NULL
       WHERE store_id = $id;
    `).run({ id })
    deleteNoPoliciesRow(id)
  })()
}

function deleteNoPoliciesRow(id: string): void {
  getDatabase().prepare(`
    DELETE FROM store_revision_policy
     WHERE store_id = $id
       AND update_revision_required = NULL
       AND delete_revision_required = NULL
  `).run({ id })
}

function numberToBoolean(val: number): boolean {
  if (val === 0) {
    return false
  } else {
    return true
  }
}

function booleanToNumber(val: boolean): number {
  if (val) {
    return 1
  } else {
    return 0
  }
}
