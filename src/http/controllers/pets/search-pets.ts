import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeSearchPetsUseCase } from '@/use-cases/factories/make-search-pets-use-case'

export async function searchPets(request: FastifyRequest, reply: FastifyReply) {
  const searchPetsQuerySchema = z.object({
    state: z.string().length(2),
    city: z.string(),
    age: z.optional(z.enum(['puppy', 'adult', 'elderly'])),
    size: z.optional(z.enum(['small', 'medium', 'big'])),
    energyLevel: z.optional(z.enum(['very low', 'low', 'medium', 'high', 'very high'])),
    independenceLevel: z.optional(z.enum(['low', 'medium', 'high'])),
    environment: z.optional(z.enum(['small', 'medium', 'big'])),
    page: z.coerce.number().default(1),
  })

  const {
    state,
    city,
    age,
    size,
    energyLevel,
    independenceLevel,
    environment,
    page,
  } = searchPetsQuerySchema.parse(request.query)

  const searchPetsUseCase = makeSearchPetsUseCase()

  const { pets } = await searchPetsUseCase.execute({
    state,
    city,
    age,
    size,
    energyLevel,
    independenceLevel,
    environment,
    page,
  })

  return reply.status(200).send({ pets })
}