export class NotFound extends Error {
  name = this.constructor.name
  constructor(namespace: string, id: string) {
    super(`The item in ${namespace}/${id} is not found`)
  }
}

export class IncorrectRevision extends Error {
  name = this.constructor.name
  constructor(namespace: string, id: string) {
    super(`The revision of the item in ${namespace}/${id} is incorrect`)
  }
}
