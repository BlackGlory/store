import { startService, stopService, getAddress } from '@test/utils.js'
import { fetch } from 'extra-fetch'
import { del } from 'extra-request'
import { url, pathname } from 'extra-request/transformers'

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('204', async () => {
    const namespace = 'namespace'
    const id = 'id'

    const res = await fetch(del(
      url(getAddress())
    , pathname(`/store/${namespace}/items/${id}`)
    ))

    expect(res.status).toBe(204)
  })
})
