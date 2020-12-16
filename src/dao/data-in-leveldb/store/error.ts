import { CustomError } from '@blackglory/errors'

export class NotFound extends CustomError {
  constructor(namespace: string, id: string) {
    super(`The item in ${namespace}/${id} is not found`)
  }
}

export class IncorrectRevision extends CustomError {
  constructor(namespace: string, id: string) {
    super(`The revision of the item in ${namespace}/${id} is incorrect`)
  }
}
