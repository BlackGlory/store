import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema } from '@src/schema.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.delete<{
    Params: {
      namespace: string
      itemId: string
    }
  }>(
    '/store/:namespace'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace

      api.Store.clear(namespace)
      return reply
        .status(204)
        .send()
    }
  )
}
