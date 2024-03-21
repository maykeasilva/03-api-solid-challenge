import { Pet, Prisma } from '@prisma/client'

export interface findManyByStateAndCityParams {
  state: string
  city: string
  age?: string 
  size?: string
  energyLevel?: string
  independenceLevel?: string
  environment?: string
  page: number
}

export interface PetsRepository {
  findById(id: string): Promise<Pet | null>
  findManyByStateAndCity(params: findManyByStateAndCityParams): Promise<Pet[]>
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
}
