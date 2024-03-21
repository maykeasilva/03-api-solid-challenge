import request from 'supertest'
import { FastifyInstance } from 'fastify'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function createAndAuthenticateOrg(app: FastifyInstance) {
  await prisma.org.create({
    data: {
      name: 'Organization X',
      personResponsible: 'John Doe',
      email: 'johndoe@example.com',
      password: await hash('123456', 6),
      whatsapp: '(32)99900-1100',
      cep: '30130-005',
      state: 'MG',
      city: 'Belo Horizonte',
      street: 'Av. Afonso Pena',
      neighborhood: 'Centro',
      number: '999',
      latitude: -19.924937,
      longitude: -43.934905,
    }
  })

  const authResponse = await request(app.server).post('/orgs/sessions').send({
    email: 'johndoe@example.com',
    password: '123456',
  })

  const { token } = authResponse.body
  const cookies = authResponse.get('Set-Cookie')

  return {
    token,
    cookies,
  }
}
