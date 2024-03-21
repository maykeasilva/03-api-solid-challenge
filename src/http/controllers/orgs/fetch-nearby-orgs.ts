import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchNearbyOrgsUseCase } from '@/use-cases/factories/make-fetch-nearby-orgs-use-case'

export async function fetchNearbyOrgs(request: FastifyRequest, reply: FastifyReply) {
  const fetchNearbyOrgsQuerySchema = z.object({
    userLatitude: z.coerce.number().refine((value) => Math.abs(value) <= 90),
    userLongitude: z.coerce.number().refine((value) => Math.abs(value) <= 180),
  })

  const { userLatitude, userLongitude } = fetchNearbyOrgsQuerySchema.parse(request.query)

  const fetchNearbyOrgsUseCase = makeFetchNearbyOrgsUseCase()

  const { orgs } = await fetchNearbyOrgsUseCase.execute({
    userLatitude,
    userLongitude,
  })

  const orgInfoWithoutPassword = orgs.map((org) => {
    const { password, ...allInfoExceptPassword } = org
    return allInfoExceptPassword
  });

  return reply.status(200).send({
    orgs: orgInfoWithoutPassword,
  })
}