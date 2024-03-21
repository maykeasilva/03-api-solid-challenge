import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { PetsRepository, findManyByStateAndCityParams } from '../pets-repository'

export class PrismaPetsRepository implements PetsRepository {
  async findById(id: string) {
    const pet = await prisma.pet.findUnique({
      where: {
        id,
      },
    })

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
    const itemsPerPage = 20

    const pets = await prisma.pet.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        age,
        size,
        energyLevel,
        independenceLevel,
        environment,
        org: {
          state,
          city,
        },
      },
      take: itemsPerPage,
      skip: (page - 1) * itemsPerPage,
    })

    return pets
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = await prisma.pet.create({
      data,
    })

    return pet
  }
}
