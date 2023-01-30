import { RevisionPolicyDAO } from '@dao/config-in-sqlite3/revision-policy/index.js'

export function getAllNamespaces(): Promise<string[]> {
  return RevisionPolicyDAO.getAllNamespacesWithRevisionPolicies()
}

export function get(namespace: string): Promise<{
  updateRevisionRequired: boolean | null
  deleteRevisionRequired: boolean | null
}> {
  return RevisionPolicyDAO.getRevisionPolicies(namespace)
}

export function setUpdateRevisionRequired(namespace: string, val: boolean): Promise<void> {
  return RevisionPolicyDAO.setUpdateRevisionRequired(namespace, val)
}

export function unsetUpdateRevisionRequired(namespace: string): Promise<void> {
  return RevisionPolicyDAO.unsetUpdateRevisionRequired(namespace)
}

export function setDeleteRevisionRequired(namespace: string, val: boolean): Promise<void> {
  return RevisionPolicyDAO.setDeleteRevisionRequired(namespace, val)
}

export function unsetDeleteRevisionRequired(namespace: string): Promise<void> {
  return RevisionPolicyDAO.unsetDeleteRevisionRequired(namespace)
}
