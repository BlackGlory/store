import { StoreDAO } from '@dao'

export async function prepareStores(storeIds: string[]) {
  for (const storeId of storeIds) {
    await StoreDAO.setItem(storeId, 'item-id', 'type', 'payload')
  }
}
