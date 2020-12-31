import { FastifyPluginAsync } from 'fastify'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get(
    '/store'
  , async (req, reply) => {
      const result = await Core.Store.listStores()
      reply.send(result)
    }
  )
}
