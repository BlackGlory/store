import { StoreDAO } from '@dao'

export async function prepareItems(namespace: string, itemNamespaces: string[]) {
  for (const id of itemNamespaces) {
    await StoreDAO.setItem(namespace, id, 'type', 'payload')
  }
}
