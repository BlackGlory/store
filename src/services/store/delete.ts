import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema } from '@src/schema'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.delete<{
    Params: {
      storeId: string
      itemId: string
    }
    Querystring: { token?: string }
  }>(
    '/store/:storeId/items/:itemId'
  , {
      schema: {
        params: {
          storeId: idSchema
        , itemId: idSchema
        }
      , querystring: { token: tokenSchema }
      , headers: {
          'if-match': { type: 'string' }
        }
      }
    }
  , async (req, reply) => {
      const storeId = req.params.storeId
      const itemId = req.params.itemId
      const token = req.query.token
      const revision = req.headers['if-match']

      try {
        await Core.Blacklist.check(storeId)
        await Core.Whitelist.check(storeId)
        await Core.TBAC.checkDeletePermission(storeId, token)
      } catch (e) {
        if (e instanceof Core.Blacklist.Forbidden) return reply.status(403).send()
        if (e instanceof Core.Whitelist.Forbidden) return reply.status(403).send()
        if (e instanceof Core.TBAC.Unauthorized) return reply.status(401).send()
        throw e
      }

      try {
        await Core.Store.del(storeId, itemId, revision)
        reply.status(204).send()
      } catch (e) {
        if (e instanceof Core.Store.NotFound) return reply.status(204).send()
        if (e instanceof Core.Store.IncorrectRevision) return reply.status(412).send()
        throw e
      }
    }
  )
}
