import { memoize } from 'lodash'

export enum ListBasedAccessControl {
  Disable
, Whitelist
, Blacklist
}

export enum NodeEnv {
  Test
, Development
, Production
}

export const NODE_ENV = memoize(function (): NodeEnv | undefined {
  switch (process.env.NODE_ENV) {
    case 'test': return NodeEnv.Test
    case 'development': return NodeEnv.Development
    case 'production': return NodeEnv.Production
  }
})

export const PORT = memoize(function (): number {
  if (process.env.STORE_PORT) {
    return Number(process.env.STORE_PORT)
  } else {
    return 8080
  }
})

export const HOST = memoize(function (): string {
  return process.env.STORE_HOST || 'localhost'
})

export const ADMIN_PASSWORD = memoize(function (): string | undefined {
  return process.env.STORE_ADMIN_PASSWORD
})

export const LIST_BASED_ACCESS_CONTROL = memoize(function (): ListBasedAccessControl {
  switch (process.env.STORE_LIST_BASED_ACCESS_CONTROL) {
    case 'whitelist': return ListBasedAccessControl.Whitelist
    case 'blacklist': return ListBasedAccessControl.Blacklist
    default: return ListBasedAccessControl.Disable
  }
})

export const TOKEN_BASED_ACCESS_CONTROL = memoize(function (): boolean {
  return process.env.STORE_TOKEN_BASED_ACCESS_CONTROL === 'true'
})

export const WRITE_TOKEN_REQUIRED = memoize(function (): boolean {
  return process.env.STORE_WRITE_TOKEN_REQUIRED === 'true'
})

export const READ_TOKEN_REQUIRED = memoize(function (): boolean {
  return process.env.STORE_READ_TOKEN_REQUIRED === 'true'
})

export const DELETE_TOKEN_REQUIRED = memoize(function (): boolean {
  return process.env.STORE_DELETE_TOKEN_REQUIRED === 'true'
})

export const HTTP2 = memoize(function (): boolean {
  return process.env.STORE_HTTP2 === 'true'
})

export const JSON_VALIDATION = memoize(function (): boolean {
  return process.env.STORE_JSON_VALIDATION === 'true'
})

export const JSON_PAYLOAD_ONLY = memoize(function (): boolean {
  return process.env.STORE_JSON_PAYLOAD_ONLY === 'true'
})

export const DEFAULT_JSON_SCHEMA = memoize(function (): string | undefined {
  return process.env.STORE_DEFAULT_JSON_SCHEMA
})

export const CI = memoize(function (): boolean {
  return process.env.CI === 'true'
})

export const PAYLOAD_LIMIT = memoize(function (): number {
  if (process.env.STORE_PAYLOAD_LIMIT) {
    return Number(process.env.STORE_PAYLOAD_LIMIT)
  } else {
    return 1048576
  }
})

export const SET_PAYLOAD_LIMIT = memoize(function (): number {
  if (process.env.STORE_SET_PAYLOAD_LIMIT) {
    return Number(process.env.STORE_SET_PAYLOAD_LIMIT)
  } else {
    return PAYLOAD_LIMIT()
  }
})

export const UPDATE_REVISION_REQUIRED = memoize(function (): boolean {
  return process.env.STORE_UPDATE_REVISION_REQUIRED === 'true'
})

export const DELETE_REVISION_REQUIRED = memoize(function (): boolean {
  return process.env.STORE_DELETE_REVISION_REQUIRED === 'true'
})
