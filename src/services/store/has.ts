import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, idSchema, tokenSchema } from '@src/schema.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.head<{
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
        , itemId: idSchema
        }
      , querystring: {
          token: tokenSchema
        }
      , headers: {
          'if-none-match': { type: 'string', nullable: true }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const id = req.params.id
      const token = req.query.token
      const revision = req.headers['if-none-match']

      try {
        api.Blacklist.check(namespace)
        api.Whitelist.check(namespace)
        api.TBAC.checkReadPermission(namespace, token)
      } catch (e) {
        if (e instanceof api.Blacklist.Forbidden) return reply.status(403).send()
        if (e instanceof api.Whitelist.Forbidden) return reply.status(403).send()
        if (e instanceof api.TBAC.Unauthorized) return reply.status(401).send()
        throw e
      }

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
