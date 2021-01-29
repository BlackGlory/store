import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema } from '@src/schema'
import accepts from 'fastify-accepts'
import { Readable } from 'stream'
import { stringifyJSONStreamAsync, stringifyNDJSONStreamAsync } from 'extra-generator'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.register(accepts)

  server.get<{
    Params: { storeId: string }
    Querystring: { token?: string }
  }>(
    '/store/:storeId/items'
  , {
      schema: {
        params: { storeId: idSchema }
      , querystring: { token: tokenSchema }
      }
    }
  , async (req, reply) => {
      const storeId = req.params.storeId
      const token = req.query.token

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

      const items = Core.Store.getAllItemIds(storeId)

      const accept = req.accepts().type(['application/json', 'application/x-ndjson'])
      if (accept === 'application/x-ndjson') {
        reply.header('Content-Type', 'application/x-ndjson')
        reply.send(Readable.from(stringifyNDJSONStreamAsync(items)))
      } else {
        reply.header('Content-Type', 'application/json')
        reply.send(Readable.from(stringifyJSONStreamAsync(items)))
      }
    }
  )
}
