import { getDatabase } from '@dao/config/database.js'

interface IRawBlacklist {
  namespace: string
}

interface IRawWhitelist {
  namespace: string
}

interface IRawTokenPolicy {
  namespace: string
  write_token_required: number | null
  read_token_required: number | null
  delete_token_required: number | null
}

interface IRawToken {
  token: string
  namespace: string
  write_permission: number
  read_permission: number
  delete_permission: number
}

export function setRawBlacklist(item: IRawBlacklist): IRawBlacklist {
  getDatabase().prepare(`
    INSERT INTO store_blacklist (namespace)
    VALUES ($namespace);
  `).run(item)

  return item
}

export function hasRawBlacklist(namespace: string): boolean {
  return !!getRawBlacklist(namespace)
}

export function getRawBlacklist(namespace: string): IRawBlacklist | undefined {
  return getDatabase().prepare(`
    SELECT *
      FROM store_blacklist
     WHERE namespace = $namespace;
  `).get({ namespace }) as IRawBlacklist | undefined
}

export function setRawWhitelist(item: IRawWhitelist): IRawWhitelist {
  getDatabase().prepare(`
    INSERT INTO store_whitelist (namespace)
    VALUES ($namespace);
  `).run(item)

  return item
}

export function hasRawWhitelist(namespace: string): boolean {
  return !!getRawWhitelist(namespace)
}

export function getRawWhitelist(namespace: string): IRawWhitelist | undefined {
  return getDatabase().prepare(`
    SELECT *
      FROM store_whitelist
     WHERE namespace = $namespace;
  `).get({ namespace }) as IRawWhitelist | undefined
}

export function setRawTokenPolicy<T extends IRawTokenPolicy>(item: T): T {
  getDatabase().prepare(`
    INSERT INTO store_token_policy (
      namespace
    , write_token_required
    , read_token_required
    , delete_token_required
    )
    VALUES (
      $namespace
    , $write_token_required
    , $read_token_required
    , $delete_token_required
    );
  `).run(item)

  return item
}

export function hasRawTokenPolicy(namespace: string): boolean {
  return !!getRawTokenPolicy(namespace)
}

export function getRawTokenPolicy(namespace: string): IRawTokenPolicy | undefined {
  return getDatabase().prepare(`
    SELECT *
      FROM store_token_policy
     WHERE namespace = $namespace;
  `).get({ namespace }) as IRawTokenPolicy | undefined
}

export function setRawToken(item: IRawToken): IRawToken {
  getDatabase().prepare(`
    INSERT INTO store_token (
      token
    , namespace
    , write_permission
    , read_permission
    , delete_permission
    )
    VALUES (
      $token
    , $namespace
    , $write_permission
    , $read_permission
    , $delete_permission
    );
  `).run(item)

  return item
}

export function hasRawToken(token: string, namespace: string): boolean {
  return !!getRawToken(token, namespace)
}

export function getRawToken(token: string, namespace: string): IRawToken | undefined {
  return getDatabase().prepare(`
    SELECT *
      FROM store_token
     WHERE token = $token
       AND namespace = $namespace;
  `).get({ token, namespace }) as IRawToken | undefined
}
