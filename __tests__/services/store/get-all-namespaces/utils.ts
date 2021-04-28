import { StoreDAO } from '@dao'

export async function prepareStores(namespaces: string[]) {
  for (const namespace of namespaces) {
    await StoreDAO.setItem(namespace, 'id', 'type', 'payload')
  }
}
