import type { Org } from '@prisma/client'
import { OrgsRepository } from '@/repositories/orgs-repository'
import { OrgAlreadyExistsError } from './errors/org-already-exists-error'
import { hash } from 'bcryptjs'

interface RegisterOrgUseCaseRequest {
  name: string
  personResponsible: string
  email: string
  password: string
  whatsapp: string
  cep: string
  state: string
  city: string
  street: string
  neighborhood: string
  number: string
  complement?: string
  latitude: number
  longitude: number
}

interface RegisterOrgUseCaseResponse {
  org: Org
}

export class RegisterOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
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
  }: RegisterOrgUseCaseRequest): Promise<RegisterOrgUseCaseResponse> {
    const orgWithSameEmail = await this.orgsRepository.findByEmail(email)

    if (orgWithSameEmail) {
      throw new OrgAlreadyExistsError()
    }

    const passwordHash = await hash(password, 6)

    const org = await this.orgsRepository.create({
      name,
      personResponsible,
      email,
      password: passwordHash,
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

    return {
      org,
    }
  }
}
