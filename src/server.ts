import fastify from 'fastify'
import cors from 'fastify-cors'
import metricsPlugin from 'fastify-metrics'
import { Registry } from 'prom-client'
import { routes as admin } from '@services/admin'
import { routes as store } from '@services/store'
import { routes as robots } from '@services/robots'
import { routes as health } from '@services/health'
import { HTTP2, PAYLOAD_LIMIT, NODE_ENV, NodeEnv } from '@env'
import { Core } from '@core'
import path from 'path'
import { path as appRoot } from 'app-root-path'
import { readJSONFileSync } from 'extra-filesystem'
import { isntUndefined, isString } from '@blackglory/types'
import { assert } from '@blackglory/errors'
import { isAcceptable } from 'extra-semver'

const pkg = readJSONFileSync<{ version: string }>(
  path.join(appRoot, 'package.json')
)

type LoggerLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export function buildServer() {
  const server = fastify({
    logger: getLoggerOptions()
  , maxParamLength: 600
    /* @ts-ignore */
  , http2: HTTP2()
  , bodyLimit: PAYLOAD_LIMIT()
  })

  server.addHook('onRequest', async (req, reply) => {
    reply.headers({ 'Cache-Control': 'private, no-cache' })
  })
  server.addHook('onRequest', async (req, reply) => {
    const acceptVersion = req.headers['accept-version']
    if (isntUndefined(acceptVersion)) {
      assert(isString(acceptVersion), 'Accept-Version must be string')
      if (!isAcceptable(pkg.version, acceptVersion)) {
        return reply.status(400).send()
      }
    }
  })

  server.register(metricsPlugin, {
    endpoint: '/metrics'
  , register: new Registry()
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
