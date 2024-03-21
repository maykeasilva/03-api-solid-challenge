import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { CreatePetUseCase } from './create-pet'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { hash } from 'bcryptjs'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let sut: CreatePetUseCase

describe('Create Pet Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    orgsRepository = new InMemoryOrgsRepository()
    sut = new CreatePetUseCase(petsRepository, orgsRepository)
  })

  it('should be able to create a pet', async () => {
    const createdOrg = await orgsRepository.create({
      name: 'Organization X',
      personResponsible: 'John Doe',
      email: 'johndoe@example.com',
      password: await hash('123456', 6),
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

    const { pet } = await sut.execute({
      name: 'Ruby',
      about: 'More about the pet',
      age: 'puppy',
      size: 'small',
      energyLevel: 'very low',
      independenceLevel: 'low',
      environment: 'small',
      orgId: createdOrg.id,
    })

    expect(pet.id).toEqual(expect.any(String))
  })

  it('should not be able to create a pet in a non-existent organization', async () => {
    await expect(() =>
      sut.execute({
        name: 'Ruby',
        about: 'More about the pet',
        age: 'puppy',
        size: 'small',
        energyLevel: 'very low',
        independenceLevel: 'low',
        environment: 'small',
        orgId: 'non-exists-org-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
