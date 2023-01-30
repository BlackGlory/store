import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema } from '@src/schema.js'

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
      const result = await Core.RevisionPolicy.getAllNamespaces()
      return reply.send(result)
    }
  )

  server.get<{
    Params: { namespace: string }
  }>(
    '/store/:namespace/revision-policies'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          200: {
            updateRevisionRequired: { type: 'boolean', nullable: true }
          , deleteRevisionRequired: { type: 'boolean', nullable: true }
          }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const result = await Core.RevisionPolicy.get(namespace)
      return reply.send(result)
    }
  )

  server.put<{
    Params: { namespace: string }
    Body: boolean
  }>(
    '/store/:namespace/revision-policies/update-revision-required'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , body: { type: 'boolean' }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const val = req.body
      await Core.RevisionPolicy.setUpdateRevisionRequired(namespace, val)
      return reply
        .status(204)
        .send()
    }
  )

  server.delete<{
    Params: { namespace: string }
  }>(
    '/store/:namespace/revision-policies/update-revision-required'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      await Core.RevisionPolicy.unsetUpdateRevisionRequired(namespace)
      return reply
        .status(204)
        .send()
    }
  )

  server.put<{
    Params: { namespace: string }
    Body: boolean
  }>(
    '/store/:namespace/revision-policies/delete-revision-required'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , body: { type: 'boolean' }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const val = req.body
      await Core.RevisionPolicy.setDeleteRevisionRequired(namespace, val)
      return reply
        .status(204)
        .send()
    }
  )

  server.delete<{
    Params: { namespace: string }
  }>(
    '/store/:namespace/revision-policies/delete-revision-required'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      await Core.RevisionPolicy.unsetDeleteRevisionRequired(namespace)
      return reply
        .status(204)
        .send()
    }
  )
}
