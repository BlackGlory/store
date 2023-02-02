import { StoreDAO } from '@dao/index.js'

export function prepareItems(namespace: string, itemNamespaces: string[]): void {
  for (const id of itemNamespaces) {
    StoreDAO.setItem(namespace, id, 'type', 'payload')
  }
}
