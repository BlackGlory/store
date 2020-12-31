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
    '/store/:storeId'
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
        await Core.TBAC.checkDeletePermission(storeId, token)
      } catch (e) {
        if (e instanceof Core.Blacklist.Forbidden) return reply.status(403).send()
        if (e instanceof Core.Whitelist.Forbidden) return reply.status(403).send()
        if (e instanceof Core.TBAC.Unauthorized) return reply.status(401).send()
        throw e
      }

      await Core.Store.clear(storeId)
      reply.status(204).send()
    }
  )
}
