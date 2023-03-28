import { getNamespaceStats as _getNamespaceStats } from '@dao/get-namespace-stats.js'
import { INamespaceStats } from '@src/contract.js'

export function getNamespaceStats(namespace: string): INamespaceStats {
  return _getNamespaceStats(namespace)
}
