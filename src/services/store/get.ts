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
      const rev = req.headers['if-none-match']

      try {
        await Core.Blacklist.check(storeId)
        await Core.Whitelist.check(storeId)
        await Core.TBAC.checkReadPermission(storeId, token)
      } catch (e) {
        if (e instanceof Core.Error.Unauthorized) return reply.status(401).send()
        if (e instanceof Core.Error.Forbidden) return reply.status(403).send()
        if (e instanceof Error) return reply.status(400).send(e.message)
        throw e
      }

      const result = await Core.Store.get(storeId, itemId)
      if (result) {
        if (rev === result.meta.rev) {
          reply.status(304).send()
        } else {
          reply
            .header('ETag', result.meta.rev)
            .send(result.doc)
        }
      } else {
        reply.status(404).send()
      }
    }
  )
}
