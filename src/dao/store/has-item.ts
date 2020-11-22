import { getItem } from './get-item'

export async function hasItem(namespace: string, id: string): Promise<boolean> {
  return await getItem(namespace, id) !== null
}
