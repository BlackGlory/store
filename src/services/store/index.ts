import { FastifyPluginAsync } from 'fastify'
import { routes as setRoutes } from './set.js'
import { routes as hasRoutes } from './has.js'
import { routes as getRoutes } from './get.js'
import { routes as getAllItemIdsRoutes } from './get-all-item-ids.js'
import { routes as getAllNamespacesRoutes } from './get-all-namespaces.js'
import { routes as deleteRoutes } from './delete.js'
import { routes as clearRoutes } from './clear.js'
import { routes as statsRoutes } from './stats.js'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.register(setRoutes, { Core })
  server.register(hasRoutes, { Core })
  server.register(getRoutes, { Core })
  server.register(getAllItemIdsRoutes, { Core })
  server.register(getAllNamespacesRoutes, { Core })
  server.register(deleteRoutes, { Core })
  server.register(clearRoutes, { Core })
  server.register(statsRoutes, { Core })
}
