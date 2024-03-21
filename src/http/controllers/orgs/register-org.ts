import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { OrgAlreadyExistsError } from '@/use-cases/errors/org-already-exists-error'
import { makeRegisterOrgUseCase } from '@/use-cases/factories/make-register-org-use-case'

export async function registerOrg(request: FastifyRequest, reply: FastifyReply) {
  const whatsappRegex = new RegExp(/^\([1-9]{2}\)9[0-9]{4}-[0-9]{4}$/)
  const cepRegex = new RegExp(/^[0-9]{5}-[0-9]{3}$/)

  const registerOrgBodySchema = z.object({
    name: z.string(),
    personResponsible: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    whatsapp: z.string().regex(whatsappRegex, 'Invalid phone number.'),
    cep: z.string().regex(cepRegex, 'Invalid CEP.'),
    state: z.string().length(2),
    city: z.string(),
    street: z.string(),
    neighborhood: z.string(),
    number: z.string(),
    complement: z.optional(z.string()),
    latitude: z.coerce.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.coerce.number().refine((value) => Math.abs(value) <= 180),
  })

  const {
    name,
    personResponsible,
    email,
    password,
    whatsapp,
    cep,
    state,
    city,
    street,
    neighborhood,
    number,
    complement,
    latitude,
    longitude,
  } = registerOrgBodySchema.parse(request.body)

  try {
    const registerOrgUseCase = makeRegisterOrgUseCase()

    await registerOrgUseCase.execute({
      name,
      personResponsible,
      email,
      password,
      whatsapp,
      cep,
      state,
      city,
      street,
      neighborhood,
      number,
      complement,
      latitude,
      longitude,
    })

    return reply.status(201).send()
  } catch (error) {
    if (error instanceof OrgAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
