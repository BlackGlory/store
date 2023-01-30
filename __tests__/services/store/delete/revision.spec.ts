import { startService, stopService, getAddress } from '@test/utils.js'
import { RevisionPolicyDAO, StoreDAO } from '@dao/index.js'
import { fetch } from 'extra-fetch'
import { del } from 'extra-request'
import { url, pathname, header } from 'extra-request/transformers'

beforeEach(startService)
afterEach(stopService)

describe('revision', () => {
  describe('delete revision optional', () => {
    describe('correct revision', () => {
      it('204', async () => {
        const namespace = 'namespace'
        const id = 'id'
        const revision = await StoreDAO.setItem(namespace, id, 'text/plain', 'document')

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/store/${namespace}/items/${id}`)
        , header('If-Match', revision)
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('incorrect revision', () => {
      it('412', async () => {
        const namespace = 'namespace'
        const id = 'id'
        await StoreDAO.setItem(namespace, id, 'text/plain', 'document')

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/store/${namespace}/items/${id}`)
        , header('If-Match', 'bad-revision')
        ))

        expect(res.status).toBe(412)
      })
    })

    describe('no revision', () => {
      it('204', async () => {
        const namespace = 'namespace'
        const id = 'id'
        await StoreDAO.setItem(namespace, id, 'text/plain', 'document')

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/store/${namespace}/items/${id}`)
        ))

        expect(res.status).toBe(204)
      })
    })
  })

  describe('delete revision required', () => {
    describe('correct revision', () => {
      it('204', async () => {
        const namespace = 'namespace'
        const id = 'id'
        const revision = await StoreDAO.setItem(namespace, id, 'text/plain', 'document')
        await RevisionPolicyDAO.setDeleteRevisionRequired(namespace, true)

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/store/${namespace}/items/${id}`)
        , header('If-Match', revision)
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('incorrect revision', () => {
      it('412', async () => {
        const namespace = 'namespace'
        const id = 'id'
        await StoreDAO.setItem(namespace, id, 'text/plain', 'document')
        await RevisionPolicyDAO.setDeleteRevisionRequired(namespace, true)

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/store/${namespace}/items/${id}`)
        , header('If-Match', 'bad-revision')
        ))

        expect(res.status).toBe(412)
      })
    })

    describe('no revision', () => {
      it('412', async () => {
        const namespace = 'namespace'
        const id = 'id'
        await StoreDAO.setItem(namespace, id, 'text/plain', 'document')
        await RevisionPolicyDAO.setDeleteRevisionRequired(namespace, true)

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/store/${namespace}/items/${id}`)
        ))

        expect(res.status).toBe(412)
      })
    })
  })
})
