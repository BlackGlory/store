import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { tokenSchema } from '@src/schema'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-leveldb/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('TBAC', () => {
  describe('GET /api/store-with-tokens', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const server = await buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/store-with-tokens'
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(200)
        expect(res.json()).toMatchSchema({
          type: 'array'
        , items: { type: 'string' }
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/store-with-tokens'
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const server = await buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/store-with-tokens'
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('GET /api/store/:id/tokens', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'GET'
        , url: `/api/store/${id}/tokens`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(200)
        expect(res.json()).toMatchSchema({
          type: 'array'
        , items: {
            type: 'object'
          , properties: {
              token: tokenSchema
            , write: { type: 'boolean' }
            , read: { type: 'boolean' }
            , delete: { type: 'boolean' }
            }
          }
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'GET'
        , url: `/api/store/${id}/tokens`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'GET'
        , url: `/api/store/${id}/tokens`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('PUT /api/store/:id/tokens/:token/write', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/store/${id}/tokens/${token}/write`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/store/${id}/tokens/${token}/write`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/store/${id}/tokens/${token}/write`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('DELETE /api/store/:id/tokens/:token/write', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/store/${id}/tokens/${token}/write`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/store/${id}/tokens/${token}/write`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/store/${id}/tokens/${token}/write`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('PUT /api/store/:id/tokens/:token/read', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/store/${id}/tokens/${token}/read`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/store/${id}/tokens/${token}/read`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/store/${id}/tokens/${token}/read`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('DELETE /api/store/:id/tokens/:token/read', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/store/${id}/tokens/${token}/read`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/store/${id}/tokens/${token}/read`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/store/${id}/tokens/${token}/read`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('PUT /api/store/:id/tokens/:token/delete', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/store/${id}/tokens/${token}/delete`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/store/${id}/tokens/${token}/delete`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/store/${id}/tokens/${token}/delete`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('DELETE /api/store/:id/tokens/:token/delete', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/store/${id}/tokens/${token}/delete`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/store/${id}/tokens/${token}/delete`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/store/${id}/tokens/${token}/delete`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })
})

function createAuthHeaders(adminPassword?: string) {
  return {
    'Authorization': `Bearer ${ adminPassword ?? process.env.STORE_ADMIN_PASSWORD }`
  }
}
