import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema } from '@src/schema.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.get<{
    Params: { namespace: string }
  }>(
    '/store/:namespace/stats'
  , {
      schema: {
        params: {
          namespace: namespaceSchema
        }
      , response: {
          200: {
            namespace: { type: 'string' }
          , items: { type: 'integer' }
          }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace

      const result = await api.Store.stats(namespace)
      return reply.send(result)
    }
  )
}
