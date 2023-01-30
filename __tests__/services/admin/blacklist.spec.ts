import { expectMatchSchema, startService, stopService, getAddress } from '@test/utils.js'
import { fetch } from 'extra-fetch'
import { get, put, del } from 'extra-request'
import { url, pathname, headers } from 'extra-request/transformers'
import { toJSON } from 'extra-response'

beforeEach(startService)
afterEach(stopService)

describe('blacklist', () => {
  describe('GET /admin/blacklist', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'

        const res = await fetch(get(
          url(getAddress())
        , pathname('/admin/blacklist')
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(200)
        expectMatchSchema(await toJSON(res), {
          type: 'array'
        , items: { type: 'string' }
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const res = await fetch(get(
          url(getAddress())
        , pathname('/admin/blacklist')
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'

        const res = await fetch(get(
          url(getAddress())
        , pathname('/admin/blacklist')
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('PUT /admin/blacklist/:namespace', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/blacklist/${namespace}`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const namespace = 'namespace'

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/blacklist/${namespace}`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/blacklist/${namespace}`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('DELETE /admin/blacklist/:namespace', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/blacklist/${namespace}`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const namespace = 'namespace'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/blacklist/${namespace}`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/blacklist/${namespace}`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })
})

function createAuthHeaders(adminPassword?: string) {
  return {
    'Authorization': `Bearer ${ adminPassword ?? process.env.STORE_ADMIN_PASSWORD }`
  }
}
