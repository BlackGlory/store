import { FastifyPluginAsync } from 'fastify'
import bearerAuthPlugin from '@fastify/bearer-auth'
import { routes as revisionPolicyRoutes } from './revision-policy.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.addContentTypeParser(
    'application/x-www-form-urlencoded'
  , { parseAs: 'string' }
  , (req, body, done) => done(null, body)
  )
  await server.register(bearerAuthPlugin, {
    keys: new Set<string>() // because auth is a function, keys will be ignored.
  , auth(key, req) {
      return api.isAdmin(key)
    }
  })

  await server.register(revisionPolicyRoutes, { prefix: '/admin', api })
}
