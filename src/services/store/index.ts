import { FastifyPluginAsync } from 'fastify'
import { routes as setRoutes } from './set'
import { routes as hasRoutes } from './has'
import { routes as getRoutes } from './get'
import { routes as listRoutes } from './list'
import { routes as deleteRoutes } from './delete'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.register(setRoutes, { Core })
  server.register(hasRoutes, { Core })
  server.register(getRoutes, { Core })
  server.register(listRoutes, { Core })
  server.register(deleteRoutes, { Core })
}
