import { getDatabase } from '@src/database.js'

interface IRawItem {
  namespace: string
  id: string
  value: string
  revision: string
}

export function setRawItem(item: IRawItem): IRawItem {
  getDatabase().prepare(`
    INSERT INTO store_item (
      namespace
    , id
    , value
    , revision
    )
    VALUES (
      $namespace
    , $id
    , $value
    , $revision
    );
  `).run(item)

  return item
}

export function hasRawItem(namespace: string, id: string): boolean {
  return !!getRawItem(namespace, id)
}

export function getRawItem(namespace: string, id: string): IRawItem | undefined {
  return getDatabase().prepare(`
    SELECT *
      FROM store_item
     WHERE namespace = $namespace
       AND id = $id;
  `).get({ namespace, id }) as IRawItem | undefined
}
