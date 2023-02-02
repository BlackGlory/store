import { FastifyPluginAsync } from 'fastify'
import { routes as setRoutes } from './set.js'
import { routes as hasRoutes } from './has.js'
import { routes as getRoutes } from './get.js'
import { routes as getAllItemIdsRoutes } from './get-all-item-ids.js'
import { routes as getAllNamespacesRoutes } from './get-all-namespaces.js'
import { routes as deleteRoutes } from './delete.js'
import { routes as clearRoutes } from './clear.js'
import { routes as statsRoutes } from './stats.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  await server.register(setRoutes, { api })
  await server.register(hasRoutes, { api })
  await server.register(getRoutes, { api })
  await server.register(getAllItemIdsRoutes, { api })
  await server.register(getAllNamespacesRoutes, { api })
  await server.register(deleteRoutes, { api })
  await server.register(clearRoutes, { api })
  await server.register(statsRoutes, { api })
}
