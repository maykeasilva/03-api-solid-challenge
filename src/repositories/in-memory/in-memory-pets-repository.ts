import { Pet, Prisma } from '@prisma/client'
import { InMemoryOrgsRepository } from './in-memory-orgs-repository'
import { PetsRepository, findManyByStateAndCityParams } from '../pets-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryPetsRepository implements PetsRepository {
  public database: Pet[] = []

  constructor(private orgsRepository?: InMemoryOrgsRepository) {}

  async findById(id: string) {
    const pet = this.database.find((item) => item.id === id)

    if (!pet) {
      return null
    }

    return pet
  }

  async findManyByStateAndCity({
    state,
    city,
    age,
    size,
    energyLevel,
    independenceLevel,
    environment,
    page,
  }: findManyByStateAndCityParams) {
    if (!this.orgsRepository) {
      throw new Error('OrgsRepository is required.')
    }
    const orgsByStateAndCity = this.orgsRepository.database.filter((item) => {
      return item.city === city && item.state === state
    })

    const itemsPerPage = 20

    const pets = this.database
      .filter((item) => orgsByStateAndCity.some((org) => org.id === item.orgId))
      .filter((item) => age ? item.age === age : true)
      .filter((item) => size ? item.size === size : true)
      .filter((item) => energyLevel ? item.energyLevel === energyLevel : true)
      .filter((item) => independenceLevel ? item.independenceLevel === independenceLevel : true)
      .filter((item) => environment ? item.environment === environment : true)
      .slice((page - 1) * itemsPerPage, page * itemsPerPage)

    return pets
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = {
      id: data.id ?? randomUUID(),
      name: data.name,
      about: data.about,
      age: data.age,
      size: data.size,
      energyLevel: data.energyLevel,
      independenceLevel: data.independenceLevel,
      environment: data.environment,
      orgId: data.orgId,
      createdAt: new Date(),
    }

    this.database.push(pet)

    return pet
  }
}
