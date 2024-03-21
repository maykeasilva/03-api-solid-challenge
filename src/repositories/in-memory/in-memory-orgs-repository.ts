import { Org, Prisma } from '@prisma/client'
import { OrgsRepository, findManyNearbyParams } from '../orgs-repository'
import { randomUUID } from 'node:crypto'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class InMemoryOrgsRepository implements OrgsRepository {
  public database: Org[] = []

  async findById(id: string) {
    const org = this.database.find((item) => item.id === id)

    if (!org) {
      return null
    }

    return org
  }

  async findByEmail(email: string) {
    const org = this.database.find((item) => item.email === email)

    if (!org) {
      return null
    }

    return org
  }

  async findManyNearby(params: findManyNearbyParams) {
    const maxDistanceInKilometers = 10

    const gyms = this.database
      .filter((item) => {
        const distance = getDistanceBetweenCoordinates(
          { latitude: params.latitude, longitude: params.longitude },
          { latitude: item.latitude.toNumber(), longitude: item.longitude.toNumber() },
        )

        return distance < maxDistanceInKilometers
      })

    return gyms
  }

  async create(data: Prisma.OrgCreateInput) {
    const org = {
      id: data.id ?? randomUUID(),
      name: data.name,
      personResponsible: data.personResponsible,
      email: data.email,
      password: data.password,
      whatsapp: data.whatsapp,
      cep: data.cep,
      state: data.state,
      city: data.city,
      street: data.street,
      neighborhood: data.neighborhood,
      number: data.number,
      complement: data.complement ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      createdAt: new Date(),
    }

    this.database.push(org)

    return org
  }
}
