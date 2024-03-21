import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { RegisterOrgUseCase } from './register-org'
import { OrgAlreadyExistsError } from './errors/org-already-exists-error'
import { compare } from 'bcryptjs'

let orgsRepository: InMemoryOrgsRepository
let sut: RegisterOrgUseCase

describe('Register Organization Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new RegisterOrgUseCase(orgsRepository)
  })

  it('should be able to register an organization', async () => {
    const { org } = await sut.execute({
      name: 'Organization X',
      personResponsible: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      whatsapp: '32999001100',
      cep: '30130-005',
      state: 'MG',
      city: 'Belo Horizonte',
      street: 'Av. Afonso Pena',
      neighborhood: 'Centro',
      number: '999',
      latitude: -19.924937,
      longitude: -43.934905,
    })

    expect(org.id).toEqual(expect.any(String))
    expect(org).toEqual(expect.objectContaining({ name: 'Organization X' }))
  })

  it('should password is hashed at the time of registration', async () => {
    const { org } = await sut.execute({
      name: 'Organization X',
      personResponsible: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      whatsapp: '32999001100',
      cep: '30130-005',
      state: 'MG',
      city: 'Belo Horizonte',
      street: 'Av. Afonso Pena',
      neighborhood: 'Centro',
      number: '999',
      latitude: -19.924937,
      longitude: -43.934905,
    })

    const isPasswordHashedCorrectly = await compare('123456', org.password)

    expect(isPasswordHashedCorrectly).toBe(true)
  })

  it('should not be able to register an organization with the same email', async () => {
    const email = 'johndoe@example.com'

    await sut.execute({
      name: 'Organization X',
      personResponsible: 'John Doe',
      email,
      password: '123456',
      whatsapp: '32999001100',
      cep: '30130-005',
      state: 'MG',
      city: 'Belo Horizonte',
      street: 'Av. Afonso Pena',
      neighborhood: 'Centro',
      number: '999',
      latitude: -19.924937,
      longitude: -43.934905,
    })

    await expect(() =>
      sut.execute({
        name: 'Organization X',
        personResponsible: 'John Doe',
        email,
        password: '123456',
        whatsapp: '32999001100',
        cep: '30130-009',
        state: 'MG',
        city: 'Belo Horizonte',
        street: 'Rua A',
        neighborhood: 'Centro',
        number: '999',
        latitude: -19.938953,
        longitude: -43.926283,
      }),
    ).rejects.toBeInstanceOf(OrgAlreadyExistsError)
  })
})
