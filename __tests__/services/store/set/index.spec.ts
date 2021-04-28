import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { StoreDAO } from '@dao'
import { fetch } from 'extra-fetch'
import { put } from 'extra-request'
import { url, pathname, text } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('204', async () => {
    const namespace = 'namespace'
    const id = 'id'
    const payload = 'document'
    await StoreDAO.setItem(namespace, id, 'text/plain', 'document')

    const res = await fetch(put(
      url(getAddress())
    , pathname(`/store/${namespace}/items/${id}`)
    , text(payload)
    ))

    expect(res.status).toBe(204)
  })
})
