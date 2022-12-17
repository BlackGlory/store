import { startService, stopService, getAddress } from '@test/utils'
import { prepareItems } from './utils'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname } from 'extra-request/lib/es2018/transformers'
import { toJSON } from 'extra-response'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('200', async () => {
    const namespace = 'namespace'
    const itemNamespaces = ['id']
    await prepareItems(namespace, itemNamespaces)

    const res = await fetch(get(
      url(getAddress())
    , pathname(`/store/${namespace}/items`)
    ))

    expect(res.status).toBe(200)
    expect(await toJSON(res)).toStrictEqual(itemNamespaces)
  })
})
