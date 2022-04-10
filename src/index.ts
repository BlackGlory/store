import { go } from '@blackglory/go'
import * as ConfigInSqlite3 from '@src/dao/config-in-sqlite3/database'
import * as DataInSqlite3 from '@src/dao/data-in-sqlite3/database'
import { buildServer } from './server'
import { PORT, HOST, CI } from '@env'
import { youDied } from 'you-died'

go(async () => {
  ConfigInSqlite3.openDatabase()
  youDied(() => ConfigInSqlite3.closeDatabase())
  await ConfigInSqlite3.prepareDatabase()

  DataInSqlite3.openDatabase()
  youDied(() => DataInSqlite3.closeDatabase())
  await DataInSqlite3.prepareDatabase()

  const server = await buildServer()
  await server.listen(PORT(), HOST())
  if (CI()) process.exit()

  process.send?.('ready')
})
