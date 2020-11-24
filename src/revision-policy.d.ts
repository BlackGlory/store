interface IRevisionPolicyDAO {
  getAllIdsWithRevisionPolicies(): Promise<string[]>
  getRevisionPolicies(storeId: string): Promise<{
    updateRevisionRequired: boolean | null
    deleteRevisionRequired: boolean | null
  }>

  setUpdateRevisionRequired(storeId: string, val: boolean): Promise<void>
  unsetUpdateRevisionRequired(storeId: string): Promise<void>

  setDeleteRevisionRequired(storeId: string, val: boolean): Promise<void>
  unsetDeleteRevisionRequired(storeId: string): Promise<void>
}
