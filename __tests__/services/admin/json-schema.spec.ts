import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { JsonSchemaDAO } from '@dao'
import { fetch } from 'extra-fetch'
import { get, put, del } from 'extra-request'
import { url, text, pathname, headers, header, json } from 'extra-request/lib/es2018/transformers'
import { toJSON } from 'extra-response'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('json schema', () => {
  describe('GET /admin/store-with-json-schema', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'

        const res = await fetch(get(
          url(getAddress())
        , pathname('/admin/store-with-json-schema')
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(200)
        expect(await toJSON(res)).toMatchSchema({
          type: 'array'
        , items: { type: 'string' }
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const res = await fetch(get(
          url(getAddress())
        , pathname('/admin/store-with-json-schema')
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'

        const res = await fetch(get(
          url(getAddress())
        , pathname('/admin/store-with-json-schema')
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('GET /admin/store/<id>/json-schema', () => {
    describe('auth', () => {
      describe('exist', () => {
        it('200', async () => {
          process.env.STORE_ADMIN_PASSWORD = 'password'
          const namespace = 'namespace'
          const schema = { type: 'number' }
          await JsonSchemaDAO.setJsonSchema({
            namespace
          , schema: JSON.stringify(schema)
          })

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/admin/store/${namespace}/json-schema`)
          , headers(createAuthHeaders())
          ))

          expect(res.status).toBe(200)
          expect(await toJSON(res)).toEqual(schema)
        })
      })

      describe('not exist', () => {
        it('404', async () => {
          process.env.STORE_ADMIN_PASSWORD = 'password'
          const namespace = 'namespace'

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/admin/store/${namespace}/json-schema`)
          , headers(createAuthHeaders())
          ))

          expect(res.status).toBe(404)
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const namespace = 'namespace'

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/admin/store/${namespace}/json-schema`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/admin/store/${namespace}/json-schema`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('PUT /admin/store/<id>/json-schema', () => {
    describe('auth', () => {
      describe('valid JSON', () => {
        it('204', async () => {
          process.env.STORE_ADMIN_PASSWORD = 'password'
          const namespace = 'namespace'
          const schema = { type: 'number' }

          const res = await fetch(put(
            url(getAddress())
          , pathname(`/admin/store/${namespace}/json-schema`)
          , headers(createAuthHeaders())
          , json(schema)
          ))

          expect(res.status).toBe(204)
        })
      })

      describe('invalid JSON', () => {
        it('400', async () => {
          process.env.STORE_ADMIN_PASSWORD = 'password'
          const namespace = 'namespace'

          const res = await fetch(put(
            url(getAddress())
          , pathname(`/admin/store/${namespace}/json-schema`)
          , headers(createAuthHeaders())
          , text('')
          , header('Content-Type', 'application/json')
          ))

          expect(res.status).toBe(400)
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const namespace = 'namespace'
        const schema = { type: 'number' }

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/store/${namespace}/json-schema`)
        , json(schema)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'
        const schema = { type: 'number' }

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/store/${namespace}/json-schema`)
        , headers(createAuthHeaders('bad'))
        , json(schema)
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('DELETE /admin/store/<id>/json-schema', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/store/${namespace}/json-schema`)
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
        , pathname(`/admin/store/${namespace}/json-schema`)
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
        , pathname(`/admin/store/${namespace}/json-schema`)
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
