import { startService, stopService, getAddress } from '@test/utils.js'
import { RevisionPolicyDAO, StoreDAO } from '@dao/index.js'
import { fetch } from 'extra-fetch'
import { put } from 'extra-request'
import { url, pathname, header, text } from 'extra-request/transformers'

beforeEach(startService)
afterEach(stopService)

describe('revision', () => {
  describe('update revision optional', () => {
    describe('correct revision', () => {
      it('204', async () => {
        const namespace = 'namespace'
        const id = 'id'
        const revision = await StoreDAO.setItem(namespace, id, 'text/plain', 'document')

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/store/${namespace}/items/${id}`)
        , header('If-Match', revision)
        , text('new document')
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('incorrect revision', () => {
      it('412', async () => {
        const namespace = 'namespace'
        const id = 'id'
        await StoreDAO.setItem(namespace, id, 'text/plain', 'document')

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/store/${namespace}/items/${id}`)
        , header('If-Match', 'bad-revision')
        , text('new document')
        ))

        expect(res.status).toBe(412)
      })
    })

    describe('no revision', () => {
      it('204', async () => {
        const namespace = 'namespace'
        const id = 'id'
        await StoreDAO.setItem(namespace, id, 'text/plain', 'document')

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/store/${namespace}/items/${id}`)
        , text('new document')
        ))

        expect(res.status).toBe(204)
      })
    })
  })

  describe('update revision required', () => {
    describe('correct revision', () => {
      it('204', async () => {
        const namespace = 'namespace'
        const id = 'id'
        const revision = await StoreDAO.setItem(namespace, id, 'text/plain', 'document')
        await RevisionPolicyDAO.setUpdateRevisionRequired(namespace, true)

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/store/${namespace}/items/${id}`)
        , header('If-Match', revision)
        , text('new document')
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('incorrect revision', () => {
      it('412', async () => {
        const namespace = 'namespace'
        const id = 'id'
        await StoreDAO.setItem(namespace, id, 'text/plain', 'document')
        await RevisionPolicyDAO.setUpdateRevisionRequired(namespace, true)

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/store/${namespace}/items/${id}`)
        , header('If-Match', 'bad-revision')
        , text('new document')
        ))

        expect(res.status).toBe(412)
      })
    })

    describe('no revision', () => {
      it('412', async () => {
        const namespace = 'namespace'
        const id = 'id'
        await StoreDAO.setItem(namespace, id, 'text/plain', 'document')
        await RevisionPolicyDAO.setUpdateRevisionRequired(namespace, true)

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/store/${namespace}/items/${id}`)
        , text('new document')
        ))

        expect(res.status).toBe(412)
      })
    })
  })
})
