import { RevisionPolicyDAO } from '@dao/config/revision-policy/index.js'

export function getAllNamespaces(): string[] {
  return RevisionPolicyDAO.getAllNamespacesWithRevisionPolicies()
}

export function get(namespace: string): {
  updateRevisionRequired: boolean | null
  deleteRevisionRequired: boolean | null
} {
  return RevisionPolicyDAO.getRevisionPolicies(namespace)
}

export function setUpdateRevisionRequired(namespace: string, val: boolean): void {
  RevisionPolicyDAO.setUpdateRevisionRequired(namespace, val)
}

export function unsetUpdateRevisionRequired(namespace: string): void {
  RevisionPolicyDAO.unsetUpdateRevisionRequired(namespace)
}

export function setDeleteRevisionRequired(namespace: string, val: boolean): void {
  RevisionPolicyDAO.setDeleteRevisionRequired(namespace, val)
}

export function unsetDeleteRevisionRequired(namespace: string): void {
  RevisionPolicyDAO.unsetDeleteRevisionRequired(namespace)
}
