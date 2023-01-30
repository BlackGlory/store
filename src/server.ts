import fastify from 'fastify'
import cors from '@fastify/cors'
import { routes as admin } from '@services/admin/index.js'
import { routes as store } from '@services/store/index.js'
import { routes as robots } from '@services/robots/index.js'
import { routes as health } from '@services/health/index.js'
import { PAYLOAD_LIMIT, NODE_ENV, NodeEnv } from '@env/index.js'
import { Core } from '@core/index.js'
import path from 'path'
import { readJSONFileSync } from 'extra-filesystem'
import { isntUndefined, isString } from '@blackglory/prelude'
import { assert } from '@blackglory/errors'
import semver from 'semver'
import { getAppRoot } from '@src/utils.js'

const pkg = readJSONFileSync<{ version: string }>(
  path.join(getAppRoot(), 'package.json')
)

type LoggerLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export function buildServer() {
  const server = fastify({
    logger: getLoggerOptions()
  , maxParamLength: 600
  , bodyLimit: PAYLOAD_LIMIT()
  , forceCloseConnections: true
  })

  server.addHook('onRequest', async (req, reply) => {
    reply.headers({ 'Cache-Control': 'private, no-cache' })
  })
  server.addHook('onRequest', async (req, reply) => {
    const acceptVersion = req.headers['accept-version']
    if (isntUndefined(acceptVersion)) {
      assert(isString(acceptVersion), 'Accept-Version must be string')
      if (!semver.satisfies(pkg.version, acceptVersion)) {
        return reply.status(400).send()
      }
    }
  })

  server.register(cors, { origin: true })
  server.register(admin, { Core })
  server.register(store, { Core })
  server.register(robots)
  server.register(health)

  return server
}

function getLoggerOptions(): { level: LoggerLevel } | boolean {
  switch (NODE_ENV()) {
    case NodeEnv.Test: return false
    case NodeEnv.Production: return { level: 'error' }
    case NodeEnv.Development: return { level: 'trace' }
    default: return false
  }
}
