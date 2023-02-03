import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, idSchema } from '@src/schema.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.delete<{
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
        , id: idSchema
        }
      , headers: {
          'if-match': { type: 'string', nullable: true }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const itemId = req.params.id
      const revision = req.headers['if-match']

      try {
        api.Store.del(namespace, itemId, revision)
        return reply
          .status(204)
          .send()
      } catch (e) {
        if (e instanceof api.Store.NotFound) return reply.status(204).send()
        if (e instanceof api.Store.IncorrectRevision) return reply.status(412).send()
        throw e
      }
    }
  )
}
