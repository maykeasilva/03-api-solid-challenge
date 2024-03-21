import { Org, Prisma } from '@prisma/client'

export interface findManyNearbyParams {
  latitude: number
  longitude: number
}

export interface OrgsRepository {
  findById(id: string): Promise<Org | null>
  findByEmail(email: string): Promise<Org | null>
  findManyNearby(params: findManyNearbyParams): Promise<Org[]>
  create(data: Prisma.OrgCreateInput): Promise<Org>
}
