import { JSONSchemaDAO } from '@dao/config/json-schema/index.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { hasRawJSONSchema, setRawJSONSchema } from './utils.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('JSON Schema', () => {
  describe('getAllNamespacesWithJSONSchema(): string[]', () => {
    it('return string[]', () => {
      const namespace = 'namespace'
      const schema = createSchema()
      setRawJSONSchema({
        namespace
      , json_schema: schema
      })

      const result = JSONSchemaDAO.getAllNamespacesWithJSONSchema()

      expect(result).toEqual([namespace])
    })
  })

  describe('getJSONSchema(namespace: string): string | null', () => {
    describe('exist', () => {
      it('return schema', () => {
        const namespace = 'namespace'
        const schema = createSchema()
        setRawJSONSchema({
          namespace
        , json_schema: schema
        })

        const result = JSONSchemaDAO.getJSONSchema(namespace)

        expect(result).toBe(schema)
      })
    })

    describe('not exist', () => {
      it('return null', () => {
        const namespace = 'namespace'

        const result = JSONSchemaDAO.getJSONSchema(namespace)

        expect(result).toBeNull()
      })
    })
  })

  describe('setJSONSchema({ namespace: string; schema: string })', () => {
    describe('exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        const schema = createSchema()
        setRawJSONSchema({
          namespace
        , json_schema: schema
        })

        const result = JSONSchemaDAO.setJSONSchema({ namespace, schema })

        expect(result).toBeUndefined()
        expect(hasRawJSONSchema(namespace)).toBe(true)
      })
    })

    describe('not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        const schema = createSchema()

        const result = JSONSchemaDAO.setJSONSchema({ namespace, schema })

        expect(result).toBeUndefined()
        expect(hasRawJSONSchema(namespace)).toBe(true)
      })
    })
  })

  describe('removeJSONSchema(namespace: string)', () => {
    describe('exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        const schema = createSchema()
        setRawJSONSchema({
          namespace
        , json_schema: schema
        })

        const result = JSONSchemaDAO.removeJSONSchema(namespace)

        expect(result).toBeUndefined()
        expect(hasRawJSONSchema(namespace)).toBe(false)
      })
    })

    describe('not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = JSONSchemaDAO.removeJSONSchema(namespace)

        expect(result).toBeUndefined()
        expect(hasRawJSONSchema(namespace)).toBe(false)
      })
    })
  })
})

function createSchema() {
  return JSON.stringify({ type: 'number' })
}
