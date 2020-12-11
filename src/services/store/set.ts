import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema } from '@src/schema'
import { SET_PAYLOAD_LIMIT, JSON_PAYLOAD_ONLY } from '@env'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.post<{
    Params: {
      storeId: string
      itemId: string
    }
    Querystring: { token?: string }
    Body: IDocument
  }>(
    '/store/:storeId/items/:itemId'
  , {
      schema: {
        params: { id: idSchema }
      , querystring: { token: tokenSchema }
      , headers: {
          'content-type': JSON_PAYLOAD_ONLY()
                          ? { type: 'string', pattern: '^application/json' }
                          : { type: 'string' }
        , 'if-match': { type: 'string' }
        }
      , body: { type: 'object' }
      , response: {
          204: { type: 'null' }
        }
      }
    , bodyLimit: SET_PAYLOAD_LIMIT()
    }
  , async (req, reply) => {
      const storeId = req.params.storeId
      const itemId = req.params.itemId
      const doc = req.body
      const token = req.query.token
      const type = req.headers['content-type'] ?? 'application/octet-stream'

      try {
        await Core.Blacklist.check(storeId)
        await Core.Whitelist.check(storeId)
        await Core.TBAC.checkWritePermission(storeId, token)
        if (Core.JsonSchema.isEnabled()) {
          if (isJSONPayload()) {
            await Core.JsonSchema.validate(storeId, doc)
          } else {
            if (await Core.JsonSchema.get(storeId)) {
              throw new Error('This id only accepts application/json')
            }
          }
        }
      } catch (e) {
        if (e instanceof Core.Error.Unauthorized) return reply.status(401).send()
        if (e instanceof Core.Error.Forbidden) return reply.status(403).send()
        if (e instanceof Error) return reply.status(400).send(e.message)
        throw e
      }

      try {
        await Core.Store.set(storeId, itemId, type, doc)
        reply.status(204).send()
      } catch (e) {
        if (e instanceof Core.Error.IncorrectRevision) return reply.status(412).send()
        throw e
      }

      function isJSONPayload(): boolean {
        const contentType = req.headers['content-type']
        if (!contentType) return false
        return contentType
          .toLowerCase()
          .startsWith('application/json')
      }
    }
  )
}
