import { FastifyPluginAsync } from 'fastify'
import { idSchema } from '@src/schema'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get(
    '/store-with-token-policies'
  , {
      schema: {
        response: {
          200: {
            type: 'array'
          , items: { type: 'string' }
          }
        }
      }
    }
  , async (req, reply) => {
      const result = await Core.TBAC.TokenPolicy.getAllIds()
      reply.send(result)
    }
  )

  server.get<{
    Params: { id: string }
  }>(
    '/store/:id/token-policies'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          200: {
            writeTokenRequired: {
              anyOf: [
                { type: 'boolean' }
              , { type: 'null' }
              ]
            }
          , readTokenRequired: {
              anyOf: [
                { type: 'boolean' }
              , { type: 'null' }
              ]
            }
          , deleteTokenRequired: {
              anyOf: [
                { type: 'boolean' }
              , { type: 'null' }
              ]
            }
          }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const result = await Core.TBAC.TokenPolicy.get(id)
      reply.send(result)
    }
  )

  server.put<{
    Params: { id: string }
    Body: boolean
  }>(
    '/store/:id/token-policies/write-token-required'
  , {
      schema: {
        params: { id: idSchema }
      , body: { type: 'boolean' }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const val = req.body
      await Core.TBAC.TokenPolicy.setWriteTokenRequired(id, val)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { id: string }
  }>(
    '/store/:id/token-policies/write-token-required'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      await Core.TBAC.TokenPolicy.unsetWriteTokenRequired(id)
      reply.status(204).send()
    }
  )

  server.put<{
    Params: { id: string }
    Body: boolean
  }>(
    '/store/:id/token-policies/read-token-required'
  , {
      schema: {
        params: { id: idSchema }
      , body: { type: 'boolean' }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const val = req.body
      await Core.TBAC.TokenPolicy.setReadTokenRequired(id, val)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { id: string }
  }>(
    '/store/:id/token-policies/read-token-required'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      await Core.TBAC.TokenPolicy.unsetReadTokenRequired(id)
      reply.status(204).send()
    }
  )

  server.put<{
    Params: { id: string }
    Body: boolean
  }>(
    '/store/:id/token-policies/delete-token-required'
  , {
      schema: {
        params: { id: idSchema }
      , body: { type: 'boolean' }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const val = req.body
      await Core.TBAC.TokenPolicy.setDeleteTokenRequired(id, val)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { id: string}
  }>(
    '/store/:id/token-policies/delete-token-required'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      await Core.TBAC.TokenPolicy.unsetDeleteTokenRequired(id)
      reply.status(204).send()
    }
  )
}
