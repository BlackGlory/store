import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, idSchema, tokenSchema } from '@src/schema'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
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
        await Core.Blacklist.check(namespace)
        await Core.Whitelist.check(namespace)
        await Core.TBAC.checkDeletePermission(namespace, token)
      } catch (e) {
        if (e instanceof Core.Blacklist.Forbidden) return reply.status(403).send()
        if (e instanceof Core.Whitelist.Forbidden) return reply.status(403).send()
        if (e instanceof Core.TBAC.Unauthorized) return reply.status(401).send()
        throw e
      }

      try {
        await Core.Store.del(namespace, itemId, revision)
        reply.status(204).send()
      } catch (e) {
        if (e instanceof Core.Store.NotFound) return reply.status(204).send()
        if (e instanceof Core.Store.IncorrectRevision) return reply.status(412).send()
        throw e
      }
    }
  )
}
