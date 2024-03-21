import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'
import { FetchNearbyOrgsUseCase } from '../fetch-nearby-orgs'

export function makeFetchNearbyOrgsUseCase() {
  const orgsRepository = new PrismaOrgsRepository()
  const useCase = new FetchNearbyOrgsUseCase(orgsRepository)

  return useCase
}
