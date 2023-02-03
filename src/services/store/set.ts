import { FastifyPluginAsync } from 'fastify'
import { idSchema, namespaceSchema } from '@src/schema.js'
import { SET_PAYLOAD_LIMIT, JSON_PAYLOAD_ONLY } from '@env/index.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  // overwrite application/json parser
  server.addContentTypeParser(
    'application/json'
  , { parseAs: 'string' }
  , (req, body, done) => done(null, body)
  )

  server.addContentTypeParser(
    '*'
  , { parseAs: 'string' }
  , (req, body, done) => done(null, body)
  )

  server.put<{
    Params: {
      namespace: string
      id: string
    }
    Body: string
  }>(
    '/store/:namespace/items/:id'
  , {
      schema: {
        params: {
          namespace: namespaceSchema
        , id: idSchema
        }
      , headers: {
          'content-type':
            JSON_PAYLOAD_ONLY()
            ? { type: 'string', pattern: '^application/json' }
            : { type: 'string' }
        , 'if-match': { type: 'string', nullable: true }
        }
      , response: {
          204: { type: 'null' }
        }
      }
    , bodyLimit: SET_PAYLOAD_LIMIT()
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const id = req.params.id
      const payload = req.body
      const type = req.headers['content-type'] ?? 'application/octet-stream'
      const revision = req.headers['if-match']

      try {
        api.Store.set(namespace, id, type, payload, revision)
        return reply
          .status(204)
          .send()
      } catch (e) {
        if (e instanceof api.Store.IncorrectRevision) return reply.status(412).send()
        throw e
      }
    }
  )
}
