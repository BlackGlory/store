import { FastifyPluginAsync } from 'fastify'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get<{
    Params: { storeId: string }
  }>(
    '/store/:storeId/stats'
  , {
      schema: {
        response: {
          200: {
            id: { type: 'string' }
          , items: { type: 'number' }
          }
        }
      }
    }
  , async (req, reply) => {
      const storeId = req.params.storeId

      const result = await Core.Store.stats(storeId)
      reply.send(result)
    }
  )
}
