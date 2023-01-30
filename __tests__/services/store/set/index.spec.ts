import { startService, stopService, getAddress } from '@test/utils.js'
import { StoreDAO } from '@dao/index.js'
import { fetch } from 'extra-fetch'
import { put } from 'extra-request'
import { url, pathname, text } from 'extra-request/transformers'

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
