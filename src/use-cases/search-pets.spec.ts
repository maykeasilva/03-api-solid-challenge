import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { SearchPetsUseCase } from './search-pets'
import { hash } from 'bcryptjs'

let orgsRepository: InMemoryOrgsRepository
let petsRepository: InMemoryPetsRepository
let sut: SearchPetsUseCase

describe('Search Pets Use Case', () => {
  beforeEach(async () => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new SearchPetsUseCase(petsRepository)

    // Organization Near
    await orgsRepository.create({
      id: 'org-near',
      name: 'Organization Near',
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
    // Organization Far
    await orgsRepository.create({
      id: 'org-far',
      name: 'Organization Far',
      personResponsible: 'Joe Bloggs',
      email: 'joebloggs@example.com',
      password: await hash('123456', 6),
      whatsapp: '32999110011',
      cep: '20090-908',
      state: 'RJ',
      city: 'Rio de Janeiro',
      street: 'Av. Rio Branco',
      neighborhood: 'Centro',
      number: '222',
      latitude: -22.904039,
      longitude: -43.178081,
    })
  })

  it('should be able to search pets', async () => {
    await petsRepository.create({
      name: 'Ruby',
      about: 'More about the pet',
      age: 'puppy',
      size: 'small',
      energyLevel: 'very low',
      independenceLevel: 'low',
      environment: 'small',
      orgId: 'org-near',
    })

    await petsRepository.create({
      name: 'Rust',
      about: 'More about the pet',
      age: 'adult',
      size: 'big',
      energyLevel: 'medium',
      independenceLevel: 'medium',
      environment: 'big',
      orgId: 'org-far',
    })

    const { pets } = await sut.execute({
      state: 'MG',
      city: 'Belo Horizonte',
      page: 1,
    })

    expect(pets).toHaveLength(1)
    expect(pets).toEqual([expect.objectContaining({ name: 'Ruby' })])
  })

  it('should be able to fetch paginated search pets', async () => {
    for (let i = 1; i <= 22; i++) {
      await petsRepository.create({
        name: `Pet Near ${i}`,
        about: 'More about the pet',
        age: 'puppy',
        size: 'small',
        energyLevel: 'very low',
        independenceLevel: 'low',
        environment: 'small',
        orgId: 'org-near',
      })
    }

    await petsRepository.create({
      name: `Pet Far`,
      about: 'More about the pet',
      age: 'adult',
      size: 'big',
      energyLevel: 'medium',
      independenceLevel: 'medium',
      environment: 'big',
      orgId: 'org-far',
    })

    const { pets } = await sut.execute({
      state: 'MG',
      city: 'Belo Horizonte',
      page: 2,
    })

    expect(pets).toHaveLength(2)
    expect(pets).toEqual([
      expect.objectContaining({ name: 'Pet Near 21'}),
      expect.objectContaining({ name: 'Pet Near 22'}),
    ])
  })

  it('should be able to search pets by characteristics', async () => {
    await petsRepository.create({
      name: 'Ruby',
      about: 'More about the pet',
      age: 'puppy',
      size: 'small',
      energyLevel: 'very low',
      independenceLevel: 'low',
      environment: 'small',
      orgId: 'org-near',
    })

    await petsRepository.create({
      name: 'Rust',
      about: 'More about the pet',
      age: 'adult',
      size: 'big',
      energyLevel: 'medium',
      independenceLevel: 'medium',
      environment: 'big',
      orgId: 'org-far',
    })

    const { pets } = await sut.execute({
      state: 'MG',
      city: 'Belo Horizonte',
      age: 'puppy',
      page: 1,
    })

    expect(pets).toHaveLength(1)
    expect(pets).toEqual([expect.objectContaining({
      name: 'Ruby',
      age: 'puppy',
    })])
  })

  it('should be able to search for pets from the same cities in different states', async () => {
    // Organization Ouro Branco - MG
    await orgsRepository.create({
      id: 'org-near',
      name: 'Organization Near',
      personResponsible: 'John Doe',
      email: 'johndoe@example.com',
      password: await hash('123456', 6),
      whatsapp: '32999001100',
      cep: '36420-000',
      state: 'MG',
      city: 'Ouro Branco',
      street: 'Av. Patriótica',
      neighborhood: 'Centro',
      number: '999',
      latitude: -20.519263,
      longitude: -43.707421,
    })
    // Organization Ouro Branco - RN
    await orgsRepository.create({
      id: 'org-far',
      name: 'Organization Far',
      personResponsible: 'Joe Bloggs',
      email: 'joebloggs@example.com',
      password: await hash('123456', 6),
      whatsapp: '32999110011',
      cep: '59347-000',
      state: 'RN',
      city: 'Ouro Branco',
      street: 'Av. Manoel Correa',
      neighborhood: 'Centro',
      number: '222',
      latitude: -6.705706,
      longitude: -36.945994,
    })

    await petsRepository.create({
      name: 'Ruby',
      about: 'More about the pet',
      age: 'puppy',
      size: 'small',
      energyLevel: 'very low',
      independenceLevel: 'low',
      environment: 'small',
      orgId: 'org-near',
    })

    await petsRepository.create({
      name: 'Rust',
      about: 'More about the pet',
      age: 'adult',
      size: 'big',
      energyLevel: 'medium',
      independenceLevel: 'medium',
      environment: 'big',
      orgId: 'org-far',
    })

    const { pets } = await sut.execute({
      state: 'RN',
      city: 'Ouro Branco',
      page: 1,
    })

    expect(pets).toHaveLength(1)
    expect(pets).toEqual([expect.objectContaining({ name: 'Rust' })])
  })
})
