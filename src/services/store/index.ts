import { FastifyPluginAsync } from 'fastify'
import { routes as setRoutes } from './set'
import { routes as hasRoutes } from './has'
import { routes as getRoutes } from './get'
import { routes as listItemsRoutes } from './list-items'
import { routes as listStoresRoutes } from './list-stores'
import { routes as deleteRoutes } from './delete'
import { routes as clearRoutes } from './clear'
import { routes as statsRoutes } from './stats'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.register(setRoutes, { Core })
  server.register(hasRoutes, { Core })
  server.register(getRoutes, { Core })
  server.register(listItemsRoutes, { Core })
  server.register(listStoresRoutes, { Core })
  server.register(deleteRoutes, { Core })
  server.register(clearRoutes, { Core })
  server.register(statsRoutes, { Core })
}
