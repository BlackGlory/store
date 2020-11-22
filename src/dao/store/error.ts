export class NotFound extends Error {
  name = this.constructor.name
  constructor(namespace: string, id: string) {
    super(`The item in ${namespace}/${id} is not found`)
  }
}

export class IncorrectHash extends Error {
  name = this.constructor.name
  constructor(namespace: string, id: string, hash: string) {
    super(`The hash ${hash} of the item in ${namespace}/${id} is incorrect`)
  }
}
