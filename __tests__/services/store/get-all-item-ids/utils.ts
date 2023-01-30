import { StoreDAO } from '@dao/index.js'

export async function prepareItems(namespace: string, itemNamespaces: string[]) {
  for (const id of itemNamespaces) {
    await StoreDAO.setItem(namespace, id, 'type', 'payload')
  }
}
