import { startService, stopService, getAddress } from '@test/utils.js'
import { StoreDAO } from '@dao/index.js'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname } from 'extra-request/transformers'

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('200', async () => {
    const namespace = 'namespace'
    const id = 'id'
    await StoreDAO.setItem(namespace, id, 'text/plain', 'document')

    const res = await fetch(get(
      url(getAddress())
    , pathname(`/store/${namespace}/items/${id}`)
    ))

    expect(res.status).toBe(200)
  })
})
