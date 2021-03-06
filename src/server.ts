import fastify from 'fastify'
import cors from 'fastify-cors'
import metricsPlugin = require('fastify-metrics')
import { Registry } from 'prom-client'
import { routes as api } from '@services/api'
import { routes as store } from '@services/store'
import { routes as robots } from '@services/robots'
import { HTTP2, PAYLOAD_LIMIT, NODE_ENV, NodeEnv } from '@env'
import { Core } from '@core'

export function buildServer() {
  const server = fastify({
    logger: getLoggerOptions()
  , maxParamLength: 600
    /* @ts-ignore */
  , http2: HTTP2()
  , bodyLimit: PAYLOAD_LIMIT()
  })
  server.register(metricsPlugin, {
    endpoint: '/metrics'
  , register: new Registry()
  })

  server.register(cors, { origin: true })
  server.register(api, { Core })
  server.register(store, { Core })
  server.register(robots)

  return server
}

function getLoggerOptions() {
  switch (NODE_ENV()) {
    case NodeEnv.Test: return false
    case NodeEnv.Production: return { level: 'error' }
    case NodeEnv.Development: return { level: 'trace' }
    default: return false
  }
}
