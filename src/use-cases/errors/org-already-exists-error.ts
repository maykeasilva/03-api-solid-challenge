export class OrgAlreadyExistsError extends Error {
  constructor() {
    super('Email alredy exists.')
  }
}
