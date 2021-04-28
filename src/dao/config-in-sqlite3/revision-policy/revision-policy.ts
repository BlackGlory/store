import { getDatabase } from '../database'

export function getAllNamespacesWithRevisionPolicies(): string[] {
  const result = getDatabase().prepare(`
    SELECT namespace
      FROM store_revision_policy;
  `).all()

  return result.map(x => x['namespace'])
}

export function getRevisionPolicies(namespace: string): {
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
     WHERE namespace = $namespace;
  `).get({ namespace })

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

export function setUpdateRevisionRequired(namespace: string, val: boolean): void {
  getDatabase().prepare(`
    INSERT INTO store_revision_policy (namespace, update_revision_required)
    VALUES ($namespace, $updateRevisionRequired)
        ON CONFLICT(namespace)
        DO UPDATE SET update_revision_required = $updateRevisionRequired;
  `).run({ namespace, updateRevisionRequired: booleanToNumber(val) })
}

export function unsetUpdateRevisionRequired(namespace: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE store_revision_policy
         SET update_revision_required = NULL
       WHERE namespace = $namespace;
    `).run({ namespace })

    deleteNoPoliciesRow(namespace)
  })()
}

export function setDeleteRevisionRequired(namespace: string, val: boolean): void {
  getDatabase().prepare(`
    INSERT INTO store_revision_policy (namespace, delete_revision_required)
    VALUES ($namespace, $deleteRevisionRequired)
        ON CONFLICT(namespace)
        DO UPDATE SET delete_revision_required = $deleteRevisionRequired;
  `).run({ namespace, deleteRevisionRequired: booleanToNumber(val) })
}

export function unsetDeleteRevisionRequired(namespace: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE store_revision_policy
         SET delete_revision_required = NULL
       WHERE namespace = $namespace;
    `).run({ namespace })

    deleteNoPoliciesRow(namespace)
  })()
}

function deleteNoPoliciesRow(namespace: string): void {
  getDatabase().prepare(`
    DELETE FROM store_revision_policy
     WHERE namespace = $namespace
       AND update_revision_required = NULL
       AND delete_revision_required = NULL
  `).run({ namespace })
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
