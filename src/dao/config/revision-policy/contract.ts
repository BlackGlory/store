export interface IRevisionPolicyDAO {
  getAllNamespacesWithRevisionPolicies(): string[]
  getRevisionPolicies(namespace: string): {
    updateRevisionRequired: boolean | null
    deleteRevisionRequired: boolean | null
  }

  setUpdateRevisionRequired(namespace: string, val: boolean): void
  unsetUpdateRevisionRequired(namespace: string): void

  setDeleteRevisionRequired(namespace: string, val: boolean): void
  unsetDeleteRevisionRequired(namespace: string): void
}
