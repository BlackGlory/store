import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, tokenSchema } from '@src/schema.js'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.delete<{
    Params: {
      namespace: string
      itemId: string
    }
    Querystring: { token?: string }
  }>(
    '/store/:namespace'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , querystring: { token: tokenSchema }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const token = req.query.token

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

      await Core.Store.clear(namespace)
      return reply
        .status(204)
        .send()
    }
  )
}
