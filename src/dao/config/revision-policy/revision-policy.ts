import { getDatabase } from '../database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const getAllNamespacesWithRevisionPolicies = withLazyStatic(function (): string[] {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT namespace
      FROM store_revision_policy;
  `), [getDatabase()]).all() as Array<{ namespace: string }>

  return result.map(x => x['namespace'])
})

export const getRevisionPolicies = withLazyStatic(function (namespace: string): {
  updateRevisionRequired: boolean | null
  deleteRevisionRequired: boolean | null
} {
  const row = lazyStatic(() => getDatabase().prepare(`
    SELECT update_revision_required
         , delete_revision_required
      FROM store_revision_policy
     WHERE namespace = $namespace;
  `), [getDatabase()]).get({ namespace }) as {
    update_revision_required: number | null
  , delete_revision_required: number | null
  } | undefined

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
})

export const setUpdateRevisionRequired = withLazyStatic(function (namespace: string, val: boolean): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO store_revision_policy (namespace, update_revision_required)
    VALUES ($namespace, $updateRevisionRequired)
        ON CONFLICT(namespace)
        DO UPDATE SET update_revision_required = $updateRevisionRequired;
  `), [getDatabase()]).run({ namespace, updateRevisionRequired: booleanToNumber(val) })
})

export const unsetUpdateRevisionRequired = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().transaction((namespace: string) => {
    lazyStatic(() => getDatabase().prepare(`
      UPDATE store_revision_policy
         SET update_revision_required = NULL
       WHERE namespace = $namespace;
    `), [getDatabase()]).run({ namespace })

    deleteNoPoliciesRow(namespace)
  }), [getDatabase()])(namespace)
})

export const setDeleteRevisionRequired = withLazyStatic(function (namespace: string, val: boolean): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO store_revision_policy (namespace, delete_revision_required)
    VALUES ($namespace, $deleteRevisionRequired)
        ON CONFLICT(namespace)
        DO UPDATE SET delete_revision_required = $deleteRevisionRequired;
  `), [getDatabase()]).run({ namespace, deleteRevisionRequired: booleanToNumber(val) })
})

export const unsetDeleteRevisionRequired = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().transaction((namespace: string) => {
    lazyStatic(() => getDatabase().prepare(`
      UPDATE store_revision_policy
         SET delete_revision_required = NULL
       WHERE namespace = $namespace;
    `), [getDatabase()]).run({ namespace })

    deleteNoPoliciesRow(namespace)
  }), [getDatabase()])(namespace)
})

const deleteNoPoliciesRow = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().prepare(`
    DELETE FROM store_revision_policy
     WHERE namespace = $namespace
       AND update_revision_required = NULL
       AND delete_revision_required = NULL
  `), [getDatabase()]).run({ namespace })
})

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
