# Store
提供以WebSocket为通讯协议的键值对数据库, 受到[CouchDB]启发.

[CouchDB]: https://couchdb.apache.org]

## Quickstart
```sh
docker run \
  --detach \
  --publish 8080:8080 \
  blackglory/store
```

## Install
### 从源代码运行
```sh
git clone https://github.com/BlackGlory/store
cd store
yarn install
yarn build
yarn bundle
yarn --silent start
```

### 从源代码构建
```sh
git clone https://github.com/BlackGlory/store
cd store
yarn install
yarn docker:build
```

### Recipes
#### docker-compose.yml
```yaml
version: '3.8'

services:
  store:
    image: 'blackglory/store'
    restart: always
    volumes:
      - 'store-data:/data'
    ports:
      - '8080:8080'

volumes:
  store-data:
```

## API
```ts
interface INamespaceStats {
  items: number
}

interface IItem {
  value: JSONValue
  revision: string
}

interface IAPI {
  getAllNamespaces(): string[]
  getAllItemIds(namespace: string): string[]

  getNamespaceStats(namespace: string): INamespaceStats

  clearItemsByNamespace(namespace: string): null

  hasItem(namespace: string, itemId: string): boolean
  getItem(namespace: string, itemId: string): IItem | null

  /**
   * @param revision
   * 可选参数, 用于实现乐观并发策略.
   * `null`表示目标项目不存在.
   * 
   * @throws {IncorrectRevision}
   * 在提供revision参数的情况下, 如果目标项目的revision值不等于参数, 或项目不存在, 则抛出此错误.
   * 
   * @returns 如果成功, 返回新的revision.
   */
  setItem(
    namespace: string
  , itemId: string
  , value: JSONValue
  , revision?: string | null
  ): string

  /**
   * @param revision 可选参数, 用于实现乐观并发策略.
   * @throws {IncorrectRevision}
   * 在提供revision参数的情况下, 如果目标项目的revision值不等于参数, 或项目不存在, 则抛出此错误.
   */
  removeItem(namespace: string, itemId: string, revision?: string): null
}

class IncorrectRevision extends CustomError {}
```

## 环境变量
### `STORE_HOST`, `STORE_PORT`
通过环境变量`STORE_HOST`和`STORE_PORT`决定服务器监听的地址和端口,
默认值为`localhost`和`8080`.

### `STORE_WS_HEARTBEAT_INTERVAL`
通过环境变量`STORE_WS_HEARTBEAT_INTERVAL`可以设置WS心跳包(ping帧)的发送间隔, 单位为毫秒.
在默认情况下, 服务不会发送心跳包,
半开连接的检测依赖于服务端和客户端的运行平台的TCP Keepalive配置.

当`STORE_WS_HEARTBEAT_INTERVAL`大于零时,
服务会通过WS的ping帧按间隔发送心跳包.

## 客户端
- JavaScript/TypeScript(Node.js, Browser): <https://github.com/BlackGlory/store-js>
