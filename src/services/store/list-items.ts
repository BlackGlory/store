import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema } from '@src/schema'
import accepts from 'fastify-accepts'
import { Readable } from 'stream'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.register(accepts)

  server.get<{
    Params: { storeId: string }
    Querystring: { token?: string }
  }>(
    '/store/:storeId/items'
  , {
      schema: {
        params: { storeId: idSchema }
      , querystring: { token: tokenSchema }
      }
    }
  , (req, reply) => {
      ;(async () => {
        const storeId = req.params.storeId
        const token = req.query.token

        try {
          await Core.Blacklist.check(storeId)
          await Core.Whitelist.check(storeId)
          await Core.TBAC.checkReadPermission(storeId, token)
        } catch (e) {
          if (e instanceof Core.Blacklist.Forbidden) return reply.status(403).send()
          if (e instanceof Core.Whitelist.Forbidden) return reply.status(403).send()
          if (e instanceof Core.TBAC.Unauthorized) return reply.status(401).send()
          throw e
        }

        const accept = req.accepts().type(['application/json', 'application/x-ndjson'])
        if (accept === 'application/x-ndjson') {
          reply.raw.setHeader('Content-Type', 'application/x-ndjson')
          Readable.from(generateNDJson(storeId)).pipe(reply.raw)
        } else {
          reply.raw.setHeader('Content-Type', 'application/json')
          Readable.from(generateJSON(storeId)).pipe(reply.raw)
        }
      })()
    }
  )

  async function* generateNDJson(storeId: string): AsyncIterable<string> {
    const asyncIter = Core.Store.listItems(storeId)[Symbol.asyncIterator]()
    const firstResult = await asyncIter.next()
    if (!firstResult.done) yield JSON.stringify(firstResult.value)
    while (true) {
      const result = await asyncIter.next()
      if (result.done) break
      yield '\n' + JSON.stringify(result.value)
    }
  }

  async function* generateJSON(storeId: string): AsyncIterable<string> {
    const asyncIter = Core.Store.listItems(storeId)[Symbol.asyncIterator]()
    const firstResult = await asyncIter.next()
    yield '['
    if (!firstResult.done) yield JSON.stringify(firstResult.value)
    while (true) {
      const result = await asyncIter.next()
      if (result.done) break
      yield ',' + JSON.stringify(result.value)
    }
    yield ']'
  }
}
