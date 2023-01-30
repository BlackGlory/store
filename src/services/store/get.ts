import { FastifyPluginAsync } from 'fastify'
import { idSchema, namespaceSchema, tokenSchema } from '@src/schema.js'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get<{
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
        await Core.Blacklist.check(namespace)
        await Core.Whitelist.check(namespace)
        await Core.TBAC.checkReadPermission(namespace, token)
      } catch (e) {
        if (e instanceof Core.Blacklist.Forbidden) return reply.status(403).send()
        if (e instanceof Core.Whitelist.Forbidden) return reply.status(403).send()
        if (e instanceof Core.TBAC.Unauthorized) return reply.status(401).send()
        throw e
      }

      const result = await Core.Store.get(namespace, id)
      if (result) {
        if (revision === result.revision) {
          return reply
            .status(304)
            .send()
        } else {
          return reply
            .header('ETag', result.revision)
            .header('Content-Type', result.type)
            .send(result.payload)
        }
      } else {
        return reply
          .status(404)
          .send()
      }
    }
  )
}
