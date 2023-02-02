import { StoreDAO } from '@dao/index.js'

export function prepareStores(namespaces: string[]): void {
  for (const namespace of namespaces) {
    StoreDAO.setItem(namespace, 'id', 'type', 'payload')
  }
}
