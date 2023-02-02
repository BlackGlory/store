import { getDatabase } from '@dao/data/database.js'

interface IRawItem {
  namespace: string
  id: string
  type: string
  payload: string
  revision: string
}

export function setRawItem(item: IRawItem): IRawItem {
  getDatabase().prepare(`
    INSERT INTO store_item (
      namespace
    , id
    , type
    , payload
    , revision
    )
    VALUES (
      $namespace
    , $id
    , $type
    , $payload
    , $revision
    );
  `).run(item)

  return item
}

export function hasRawItem(namespace: string, id: string): boolean {
  return !!getRawItem(namespace, id)
}

export function getRawItem(namespace: string, id: string): IRawItem | null {
  return getDatabase().prepare(`
    SELECT *
      FROM store_item
     WHERE namespace = $namespace
       AND id = $id;
  `).get({ namespace, id })
}
