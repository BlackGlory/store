import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema } from '@src/schema.js'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get<{
    Params: { namespace: string }
  }>(
    '/store/:namespace/stats'
  , {
      schema: {
        params: {
          namespace: namespaceSchema
        }
      , response: {
          200: {
            namespace: { type: 'string' }
          , items: { type: 'integer' }
          }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace

      const result = await Core.Store.stats(namespace)
      return reply.send(result)
    }
  )
}
