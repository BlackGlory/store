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
  server.register(setRoutes, { api })
  server.register(hasRoutes, { api })
  server.register(getRoutes, { api })
  server.register(getAllItemIdsRoutes, { api })
  server.register(getAllNamespacesRoutes, { api })
  server.register(deleteRoutes, { api })
  server.register(clearRoutes, { api })
  server.register(statsRoutes, { api })
}
