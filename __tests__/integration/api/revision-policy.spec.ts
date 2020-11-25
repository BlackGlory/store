import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-leveldb/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('RevisionPolicy', () => {
  describe('GET /api/store-with-revision-policies', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const server = await buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/store-with-revision-policies'
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
        , url: '/api/store-with-revision-policies'
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
        , url: '/api/store-with-revision-policies'
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('GET /api/store/:id/revision-policies', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'GET'
        , url: `/api/store/${id}/revision-policies`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(200)
        expect(res.json()).toMatchSchema({
          type: 'object'
        , properties: {
            writeTokenRequired: {
              oneOf: [
                { type: 'boolean' }
              , { type: 'null' }
              ]
            }
          , readTokenRequired: {
              oneOf: [
                { type: 'boolean' }
              , { type: 'null' }
              ]
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
        , url: `/api/store/${id}/revision-policies`
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
        , url: `/api/store/${id}/revision-policies`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('PUT /api/store/:id/revision-policies/update-revision-required', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const val = true

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/store/${id}/revision-policies/update-revision-required`
        , payload: JSON.stringify(val)
        , headers: {
            ...createJsonHeaders()
          , ...createAuthHeaders()
          }
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'
        const val = true

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/store/${id}/revision-policies/update-revision-required`
        , payload: JSON.stringify(val)
        , headers: {
            ...createJsonHeaders()
          }
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const val = true

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/store/${id}/revision-policies/update-revision-required`
        , payload: JSON.stringify(val)
        , headers: {
            ...createJsonHeaders()
          , ...createAuthHeaders('bad')
          }
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('PUT /api/store/:id/revision-policies/delete-revision-required', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const val = true

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/store/${id}/revision-policies/delete-revision-required`
        , payload: JSON.stringify(val)
        , headers: {
            ...createJsonHeaders()
          , ...createAuthHeaders()
          }
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'
        const val = true

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/store/${id}/revision-policies/delete-revision-required`
        , payload: JSON.stringify(val)
        , headers: createJsonHeaders()
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const val = true

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/store/${id}/revision-policies/delete-revision-required`
        , payload: JSON.stringify(val)
        , headers: {
            ...createJsonHeaders()
          , ...createAuthHeaders('bad')
          }
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('DELETE /api/store/:id/revision-policies/update-revision-required', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/store/${id}/revision-policies/update-revision-required`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/store/${id}/revision-policies/update-revision-required`
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
          method: 'DELETE'
        , url: `/api/store/${id}/revision-policies/update-revision-required`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('DELETE /api/store/:id/revision-policies/delete-revision-required', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.STORE_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/store/${id}/revision-policies/delete-revision-required`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/store/${id}/revision-policies/delete-revision-required`
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
          method: 'DELETE'
        , url: `/api/store/${id}/revision-policies/delete-revision-required`
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

function createJsonHeaders() {
  return {
    'Content-Type': 'application/json'
  }
}
