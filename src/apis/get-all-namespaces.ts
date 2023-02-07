import { getAllNamespaces as _getAllNamespaces } from '@dao/get-all-namespaces.js'

export function getAllNamespaces(): string[] {
  return _getAllNamespaces()
}
