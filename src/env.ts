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

export function NODE_ENV(): NodeEnv | undefined {
  switch (process.env.NODE_ENV) {
    case 'test': return NodeEnv.Test
    case 'development': return NodeEnv.Development
    case 'production': return NodeEnv.Production
  }
}

export function PORT(): number {
  if (process.env.STORE_PORT) {
    return Number(process.env.STORE_PORT)
  } else {
    return 8080
  }
}

export function HOST(): string {
  return process.env.STORE_HOST || 'localhost'
}

export function ADMIN_PASSWORD(): string | undefined {
  return process.env.STORE_ADMIN_PASSWORD
}

export function LIST_BASED_ACCESS_CONTROL(): ListBasedAccessControl {
  switch (process.env.STORE_LIST_BASED_ACCESS_CONTROL) {
    case 'whitelist': return ListBasedAccessControl.Whitelist
    case 'blacklist': return ListBasedAccessControl.Blacklist
    default: return ListBasedAccessControl.Disable
  }
}

export function TOKEN_BASED_ACCESS_CONTROL(): boolean {
  return process.env.STORE_TOKEN_BASED_ACCESS_CONTROL === 'true'
}

export function WRITE_TOKEN_REQUIRED(): boolean {
  return process.env.STORE_WRITE_TOKEN_REQUIRED === 'true'
}

export function READ_TOKEN_REQUIRED(): boolean {
  return process.env.STORE_READ_TOKEN_REQUIRED === 'true'
}

export function DELETE_TOKEN_REQUIRED(): boolean {
  return process.env.STORE_DELETE_TOKEN_REQUIRED === 'true'
}

export function HTTP2(): boolean {
  return process.env.STORE_HTTP2 === 'true'
}

export function JSON_VALIDATION(): boolean {
  return process.env.STORE_JSON_VALIDATION === 'true'
}

export function JSON_PAYLOAD_ONLY(): boolean {
  return process.env.STORE_JSON_PAYLOAD_ONLY === 'true'
}

export function DEFAULT_JSON_SCHEMA(): string | undefined {
  return process.env.STORE_DEFAULT_JSON_SCHEMA
}

export function CI(): boolean {
  return process.env.CI === 'true'
}

export function PAYLOAD_LIMIT(): number {
  if (process.env.STORE_PAYLOAD_LIMIT) {
    return Number(process.env.STORE_PAYLOAD_LIMIT)
  } else {
    return 1048576
  }
}

export function WRITE_PAYLOAD_LIMIT(): number {
  if (process.env.STORE_WRITE_PAYLOAD_LIMIT) {
    return Number(process.env.STORE_WRITE_PAYLOAD_LIMIT)
  } else {
    return PAYLOAD_LIMIT()
  }
}

export function UPDATE_REVISION_REQUIRED(): boolean {
  return process.env.STORE_UPDATE_REVISION_REQUIRED === 'true'
}

export function DELETE_REVISION_REQUIRED(): boolean {
  return process.env.STORE_DELETE_REVISION_REQUIRED === 'true'
}
