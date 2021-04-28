interface IRevisionPolicyDAO {
  getAllNamespacesWithRevisionPolicies(): Promise<string[]>
  getRevisionPolicies(namespace: string): Promise<{
    updateRevisionRequired: boolean | null
    deleteRevisionRequired: boolean | null
  }>

  setUpdateRevisionRequired(namespace: string, val: boolean): Promise<void>
  unsetUpdateRevisionRequired(namespace: string): Promise<void>

  setDeleteRevisionRequired(namespace: string, val: boolean): Promise<void>
  unsetDeleteRevisionRequired(namespace: string): Promise<void>
}
