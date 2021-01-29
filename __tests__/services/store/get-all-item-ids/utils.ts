import { StoreDAO } from '@dao'

export async function prepareItems(storeId: string, itemIds: string[]) {
  for (const itemId of itemIds) {
    await StoreDAO.setItem(storeId, itemId, 'type', 'payload')
  }
}
