import { FastifyPluginAsync } from 'fastify'
import { idSchema } from '@src/schema'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get(
    '/store-with-revision-policies'
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
      const result = await Core.RevisionPolicy.getAllIds()
      reply.send(result)
    }
  )

  server.get<{
    Params: { id: string }
  }>(
    '/store/:id/revision-policies'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          200: {
            updateRevisionRequired: {
              anyOf: [
                { type: 'boolean' }
              , { type: 'null' }
              ]
            }
          , deleteRevisionRequired: {
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
      const result = await Core.RevisionPolicy.get(id)
      reply.send(result)
    }
  )

  server.put<{
    Params: { id: string }
    Body: boolean
  }>(
    '/store/:id/revision-policies/update-revision-required'
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
      await Core.RevisionPolicy.setUpdateRevisionRequired(id, val)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { id: string }
  }>(
    '/store/:id/revision-policies/update-revision-required'
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
      await Core.RevisionPolicy.unsetUpdateRevisionRequired(id)
      reply.status(204).send()
    }
  )

  server.put<{
    Params: { id: string }
    Body: boolean
  }>(
    '/store/:id/revision-policies/delete-revision-required'
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
      await Core.RevisionPolicy.setDeleteRevisionRequired(id, val)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { id: string }
  }>(
    '/store/:id/revision-policies/delete-revision-required'
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
      await Core.RevisionPolicy.unsetDeleteRevisionRequired(id)
      reply.status(204).send()
    }
  )
}
