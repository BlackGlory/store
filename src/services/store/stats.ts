import { FastifyPluginAsync } from 'fastify'
import { idSchema } from '@src/schema'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get<{
    Params: { storeId: string }
  }>(
    '/store/:storeId/stats'
  , {
      schema: {
        params: {
          storeId: idSchema
        }
      , response: {
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
