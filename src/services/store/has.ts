import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, idSchema } from '@src/schema.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.head<{
    Params: {
      namespace: string
      id: string
    }
  }>(
    '/store/:namespace/items/:id'
  , {
      schema: {
        params: {
          namespace: namespaceSchema
        , itemId: idSchema
        }
      , headers: {
          'if-none-match': { type: 'string', nullable: true }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const id = req.params.id
      const revision = req.headers['if-none-match']

      const result = api.Store.get(namespace, id)
      if (result) {
        if (revision === result.revision) {
          return reply
            .status(304)
            .send()
        } else {
          return reply
            .header('ETag', result.revision)
            .status(204)
            .send()
        }
      } else {
        return reply
          .status(404)
          .send()
      }
    }
  )
}
