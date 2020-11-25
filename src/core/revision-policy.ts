import { RevisionPolicyDAO } from '@dao/config-in-sqlite3/revision-policy'

export function getAllIds(): Promise<string[]> {
  return RevisionPolicyDAO.getAllIdsWithRevisionPolicies()
}

export function get(id: string): Promise<{
  updateRevisionRequired: boolean | null
  deleteRevisionRequired: boolean | null
}> {
  return RevisionPolicyDAO.getRevisionPolicies(id)
}

export function setUpdateRevisionRequired(id: string, val: boolean): Promise<void> {
  return RevisionPolicyDAO.setUpdateRevisionRequired(id, val)
}

export function unsetUpdateRevisionRequired(id: string): Promise<void> {
  return RevisionPolicyDAO.unsetUpdateRevisionRequired(id)
}

export function setDeleteRevisionRequired(id: string, val: boolean): Promise<void> {
  return RevisionPolicyDAO.setDeleteRevisionRequired(id, val)
}

export function unsetDeleteRevisionRequired(id: string): Promise<void> {
  return RevisionPolicyDAO.unsetDeleteRevisionRequired(id)
}
