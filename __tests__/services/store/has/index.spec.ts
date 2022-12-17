import { startService, stopService, getAddress } from '@test/utils'
import { StoreDAO } from '@dao'
import { fetch } from 'extra-fetch'
import { head } from 'extra-request'
import { url, pathname } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('204', async () => {
    const namespace = 'namespace'
    const id = 'id'
    await StoreDAO.setItem(namespace, id, 'text/plain', 'document')

    const res = await fetch(head(
      url(getAddress())
    , pathname(`/store/${namespace}/items/${id}`)
    ))

    expect(res.status).toBe(204)
  })
})
