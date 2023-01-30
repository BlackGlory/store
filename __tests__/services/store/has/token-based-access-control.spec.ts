import { startService, stopService, getAddress } from '@test/utils.js'
import { AccessControlDAO, StoreDAO } from '@dao/index.js'
import { fetch } from 'extra-fetch'
import { head } from 'extra-request'
import { url, pathname, searchParam } from 'extra-request/transformers'

beforeEach(startService)
afterEach(stopService)

describe('token-based access control', () => {
  describe('enabled', () => {
    describe('namespace need delete tokens', () => {
      describe('token matched', () => {
        it('204', async () => {
          process.env.STORTOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const id = 'id'
          const token = 'token'
          await StoreDAO.setItem(namespace, id, 'text/plain', 'document')
          await AccessControlDAO.setReadTokenRequired(namespace, true)
          await AccessControlDAO.setReadToken({ namespace, token })

          const res = await fetch(head(
            url(getAddress())
          , pathname(`/store/${namespace}/items/${id}`)
          , searchParam('token', token)
          ))

          expect(res.status).toBe(204)
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.STORE_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const id = 'id'
          const token = 'token'
          await StoreDAO.setItem(namespace, id, 'text/plain', 'document')
          await AccessControlDAO.setReadTokenRequired(namespace, true)
          await AccessControlDAO.setReadToken({ namespace, token })

          const res = await fetch(head(
            url(getAddress())
          , pathname(`/store/${namespace}/items/${id}`)
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('no token', () => {
        it('401', async () => {
          process.env.STORE_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const id = 'id'
          const token = 'token'
          await StoreDAO.setItem(namespace, id, 'text/plain', 'document')
          await AccessControlDAO.setReadTokenRequired(namespace, true)
          await AccessControlDAO.setReadToken({ namespace, token })

          const res = await fetch(head(
            url(getAddress())
          , pathname(`/store/${namespace}/items/${id}`)
          ))

          expect(res.status).toBe(401)
        })
      })
    })

    describe('namespace does not need delete tokens', () => {
      describe('READ_TOKEN_REQUIRED=true', () => {
        it('401', async () => {
          process.env.STORE_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.STORE_READ_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'
          const id = 'id'
          await StoreDAO.setItem(namespace, id, 'text/plain', 'document')

          const res = await fetch(head(
            url(getAddress())
          , pathname(`/store/${namespace}/items/${id}`)
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('READ_TOKEN_REQUIRED=false', () => {
        it('204', async () => {
          process.env.STORE_TOKEN_BASED_ACCESS_CONTROL = 'true'
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
    })
  })

  describe('disabled', () => {
    describe('namespace need delete tokens', () => {
      describe('no token', () => {
        it('204', async () => {
          const namespace = 'namespace'
          const id = 'id'
          const token = 'token'
          await StoreDAO.setItem(namespace, id, 'text/plain', 'document')
          await AccessControlDAO.setReadTokenRequired(namespace, true)
          await AccessControlDAO.setReadToken({ namespace, token })

          const res = await fetch(head(
            url(getAddress())
          , pathname(`/store/${namespace}/items/${id}`)
          ))

          expect(res.status).toBe(204)
        })
      })
    })

    describe('namespace does not need delete tokens', () => {
      describe('READ_TOKEN_REQUIRED=true', () => {
        it('204', async () => {
          process.env.STORE_READ_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'
          const id = 'id'
          const token = 'token'
          await StoreDAO.setItem(namespace, id, 'text/plain', 'document')
          await AccessControlDAO.setReadTokenRequired(namespace, true)
          await AccessControlDAO.setReadToken({ namespace, token })

          const res = await fetch(head(
            url(getAddress())
          , pathname(`/store/${namespace}/items/${id}`)
          ))

          expect(res.status).toBe(204)
        })
      })
    })
  })
})
