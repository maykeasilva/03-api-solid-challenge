import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeGetOrgProfileUseCase } from '@/use-cases/factories/make-get-org-profile-use-case'

export async function getOrgProfile(request: FastifyRequest, reply: FastifyReply) {
  const getOrgProfileParamsSchema = z.object({
    orgId: z.string().uuid(),
  })

  const { orgId } = getOrgProfileParamsSchema.parse(request.params)

  try {
    const getOrgProfileUseCase = makeGetOrgProfileUseCase()

    const { org } = await getOrgProfileUseCase.execute({
      orgId,
    })

    return reply.status(200).send({
      ...org,
      password: undefined,
    })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}