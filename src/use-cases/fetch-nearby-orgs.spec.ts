import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { FetchNearbyOrgsUseCase } from './fetch-nearby-orgs'
import { hash } from 'bcryptjs'

let orgsRepository: InMemoryOrgsRepository
let sut: FetchNearbyOrgsUseCase

describe('Fetch Nearby Orgs Use Case', () => {
  beforeEach(async () => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new FetchNearbyOrgsUseCase(orgsRepository)
  })

  it('should be able to fetch nearby orgs', async () => {
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

    const { orgs } = await sut.execute({
      userLatitude: -19.925043,
      userLongitude: -43.943800,
    })

    expect(orgs).toHaveLength(1)
    expect(orgs).toEqual([expect.objectContaining({ name: 'Organization Near' })])
  })
})
