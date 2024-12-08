export abstract class Failure {
  constructor(
    readonly code: string,
    readonly reason: string,
  ) {}
}

export function isFailure(x: unknown): x is Failure {
  return x instanceof Failure
}

export class ImageReferencedByProducts extends Failure {
  constructor(readonly productnames: string[]) {
    super('cim-01', 'The image was still referenced by products.')
  }
}

export class ProductValidationFailed extends Failure {
  constructor(readonly error: unknown) {
    super('cpr-01', 'Validation for the provided Product failed')
  }
}

export class ErrorInCosmosDbAccess extends Failure {
  constructor(readonly error: TypeError) {
    super('cdb-00', 'An Error was thrown when accessing Azure Cosmos DB')
  }
}

export class ProductWithIdNotFound extends Failure {
  constructor(readonly id: string) {
    super(
      'cdb-01',
      `The product with id ${id} wasn't found in the Azure Cosmos DB`,
    )
  }
}

export class ErrorInBlobStorageAccess extends Failure {
  constructor(readonly error: TypeError) {
    super('bls-00', 'An Error was thrown when accessing Azure Blob Storage')
  }
}

export class DownloadDidntReturnStream extends Failure {
  constructor(imagename: string) {
    super(
      'bls-01',
      `Azure Blob Storage didn't return a ReadStream when downloading ${imagename}`,
    )
  }
}
