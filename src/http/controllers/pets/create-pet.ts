import { FastifyReply, FastifyRequest } from "fastify";
import { z } from 'zod'
import { makeCreatePetUseCase } from '@/use-cases/factories/make-create-pet-use-case'

export async function createPet(request: FastifyRequest, reply: FastifyReply) {
  const createPetBodySchema = z.object({
    name: z.string(),
    about: z.string().min(1).max(300),
    age: z.enum(['puppy', 'adult', 'elderly']),
    size: z.enum(['small', 'medium', 'big']),
    energyLevel: z.enum(['very low', 'low', 'medium', 'high', 'very high']),
    independenceLevel: z.enum(['low', 'medium', 'high']),
    environment: z.enum(['small', 'medium', 'big']),
  })

  const orgId = request.user.sub
  const {
    name,
    about,
    age,
    size,
    energyLevel,
    independenceLevel,
    environment,
  } = createPetBodySchema.parse(request.body)

  const createPetUseCase = makeCreatePetUseCase()

  await createPetUseCase.execute({
    name,
    about,
    age,
    size,
    energyLevel,
    independenceLevel,
    environment,
    orgId,
  })

  return reply.status(201).send()
}
