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
      const rev = req.headers['if-match']

      try {
        await Core.Blacklist.check(storeId)
        await Core.Whitelist.check(storeId)
        await Core.TBAC.checkDeletePermission(storeId, token)
      } catch (e) {
        if (e instanceof Core.Error.Unauthorized) return reply.status(401).send()
        if (e instanceof Core.Error.Forbidden) return reply.status(403).send()
        if (e instanceof Error) return reply.status(400).send(e.message)
        throw e
      }

      try {
        await Core.Store.remove(storeId, itemId, rev)
        reply.status(204).send()
      } catch (e) {
        if (e instanceof Core.Error.NotFound) return reply.status(404).send()
        if (e instanceof Core.Error.IncorrectRevision) return reply.status(412).send()
        throw e
      }
    }
  )
}
