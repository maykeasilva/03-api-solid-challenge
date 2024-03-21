import type { Pet } from '@prisma/client'
import { PetsRepository } from '@/repositories/pets-repository'

interface SearchPetsUseCaseRequest {
  state: string
  city: string
  age?: string
  size?: string
  energyLevel?: string
  independenceLevel?: string
  environment?: string
  page: number
}

interface SearchPetsUseCaseResponse {
  pets: Pet[]
}

export class SearchPetsUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    state,
    city,
    age,
    size,
    energyLevel,
    independenceLevel,
    environment,
    page,
  }: SearchPetsUseCaseRequest): Promise<SearchPetsUseCaseResponse> {
    const pets = await this.petsRepository.findManyByStateAndCity({
      state,
      city,
      age,
      size,
      energyLevel,
      independenceLevel,
      environment,
      page,
    })

    return {
      pets,
    }
  }
}
