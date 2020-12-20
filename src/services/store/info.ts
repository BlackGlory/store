import { FastifyPluginAsync } from 'fastify'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get(
    '/store'
  , {
      schema: {
        response: {
          200: {
            type: 'array'
          , items: {
              type: 'object'
            , properties: {
                id: { type: 'string' }
              , items: { type: 'number' }
              }
            }
          }
        }
      }
    }
  , async (req, reply) => {
      const result = await Core.Store.info()
      reply.send(result)
    }
  )
}
