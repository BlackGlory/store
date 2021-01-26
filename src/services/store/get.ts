import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema } from '@src/schema'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get<{
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
      , querystring: {
          token: tokenSchema
        }
      , headers: {
          'if-none-match': { type: 'string' }
        }
      }
    }
  , async (req, reply) => {
      const storeId = req.params.storeId
      const itemId = req.params.itemId
      const token = req.query.token
      const revision = req.headers['if-none-match']

      try {
        await Core.Blacklist.check(storeId)
        await Core.Whitelist.check(storeId)
        await Core.TBAC.checkReadPermission(storeId, token)
      } catch (e) {
        if (e instanceof Core.Blacklist.Forbidden) return reply.status(403).send()
        if (e instanceof Core.Whitelist.Forbidden) return reply.status(403).send()
        if (e instanceof Core.TBAC.Unauthorized) return reply.status(401).send()
        throw e
      }

      const result = await Core.Store.get(storeId, itemId)
      if (result) {
        if (revision === result.revision) {
          reply.status(304).send()
        } else {
          reply
            .header('ETag', result.revision)
            .header('Content-Type', result.type)
            .send(result.payload)
        }
      } else {
        reply.status(404).send()
      }
    }
  )
}
