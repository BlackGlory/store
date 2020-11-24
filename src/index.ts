import { prepareDatabase as prepareConfigInSqlite3Database } from '@src/dao/config-in-sqlite3/database'
import { prepareDatabase as prepareDataInLevelDBDatabase } from '@src/dao/data-in-leveldb/database'
import { buildServer } from './server'
import { PORT, HOST, CI } from '@env'

process.on('SIGHUP', () => process.exit(1))

;(async () => {
  await prepareConfigInSqlite3Database()
  await prepareDataInLevelDBDatabase()

  const server = await buildServer()
  await server.listen(PORT(), HOST())
  if (CI()) await server.close()
})()
