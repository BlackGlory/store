import { Mutex } from 'extra-promise'

interface MutexStore {
  [key: string]: {
    mutex: Mutex
    pending: number
  }
}

const mutexStore: MutexStore = {}

export async function acquire<T>(namespace: string, id: string, handler: () => T | Promise<T>): Promise<T> {
  const key = createKey(namespace, id)
  if (!(key in mutexStore)) {
    mutexStore[key] = {
      mutex: new Mutex()
    , pending: 0
    }
  }

  mutexStore[key].pending++
  const release = await mutexStore[key].mutex.acquire()
  try {
    return await handler()
  } finally {
    mutexStore[key].pending--
    if (mutexStore[key].pending === 0) delete mutexStore[key]
    release()
  }
}

function createKey(namespace: string, id: string) {
  return JSON.stringify([namespace, id])
}
