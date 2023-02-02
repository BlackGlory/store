import { startService, stopService, getAddress } from '@test/utils.js'
import { StoreDAO } from '@dao/index.js'
import { fetch } from 'extra-fetch'
import { head } from 'extra-request'
import { url, pathname } from 'extra-request/transformers'

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('204', async () => {
    const namespace = 'namespace'
    const id = 'id'
    StoreDAO.setItem(namespace, id, 'text/plain', 'document')

    const res = await fetch(head(
      url(getAddress())
    , pathname(`/store/${namespace}/items/${id}`)
    ))

    expect(res.status).toBe(204)
  })
})
