import { FastifyPluginAsync } from 'fastify'
import accepts from '@fastify/accepts'
import { Readable } from 'stream'
import { stringifyJSONStreamAsync, stringifyNDJSONStreamAsync } from 'extra-generator'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.register(accepts)

  server.get(
    '/store'
  , (req, reply) => {
      const result = Core.Store.getAllNamespaces()

      const accept = req.accepts().type(['application/json', 'application/x-ndjson'])
      if (accept === 'application/x-ndjson') {
        return reply
          .status(200)
          .header('Content-Type', 'application/x-ndjson')
          .send(Readable.from(stringifyNDJSONStreamAsync(result)))
      } else {
        return reply
          .status(200)
          .header('Content-Type', 'application/json')
          .send(Readable.from(stringifyJSONStreamAsync(result)))
      }
    }
  )
}
