import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { GetPetDetailsUseCase } from './get-pet-details'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let petsRepository: InMemoryPetsRepository
let sut: GetPetDetailsUseCase

describe('Get Pet Details Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    sut = new GetPetDetailsUseCase(petsRepository)
  })

  it('should be able to get pet details', async () => {
    const createdPet = await petsRepository.create({
      name: 'Ruby',
      about: 'More about the pet',
      age: 'puppy',
      size: 'small',
      energyLevel: 'very low',
      independenceLevel: 'low',
      environment: 'small',
      orgId: 'org-x',
    })

    const { pet } = await sut.execute({
      petId: createdPet.id
    })

    expect(pet.id).toEqual(expect.any(String))
    expect(pet).toEqual(expect.objectContaining({ name: 'Ruby' }))
  })

  it('should not be able to get details non-existent pet', async () => {
    await expect(() =>
      sut.execute({
        petId: 'non-exists-pet-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
