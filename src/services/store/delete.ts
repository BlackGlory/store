import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, idSchema, tokenSchema } from '@src/schema.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.delete<{
    Params: {
      namespace: string
      id: string
    }
    Querystring: { token?: string }
  }>(
    '/store/:namespace/items/:id'
  , {
      schema: {
        params: {
          namespace: namespaceSchema
        , id: idSchema
        }
      , querystring: { token: tokenSchema }
      , headers: {
          'if-match': { type: 'string', nullable: true }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const itemId = req.params.id
      const token = req.query.token
      const revision = req.headers['if-match']

      try {
        api.Blacklist.check(namespace)
        api.Whitelist.check(namespace)
        api.TBAC.checkDeletePermission(namespace, token)
      } catch (e) {
        if (e instanceof api.Blacklist.Forbidden) return reply.status(403).send()
        if (e instanceof api.Whitelist.Forbidden) return reply.status(403).send()
        if (e instanceof api.TBAC.Unauthorized) return reply.status(401).send()
        throw e
      }

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
