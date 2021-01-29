import { FastifyPluginAsync } from 'fastify'
import { toArrayAsync } from 'iterable-operator'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get(
    '/store'
  , async (req, reply) => {
      const result = await toArrayAsync(Core.Store.getAllStoreIds())
      reply.send(result)
    }
  )
}
