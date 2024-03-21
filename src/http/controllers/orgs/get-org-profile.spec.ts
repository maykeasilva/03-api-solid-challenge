import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '@/lib/prisma'
import { app } from '@/app'

describe('Get Org Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get org profile', async () => {
    await request(app.server).post('/orgs').send({
      name: 'Organization X',
      personResponsible: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      whatsapp: '(32)99900-1100',
      cep: '30130-005',
      state: 'MG',
      city: 'Belo Horizonte',
      street: 'Av. Afonso Pena',
      neighborhood: 'Centro',
      number: '999',
      latitude: -19.924937,
      longitude: -43.934905,
    })

    const org = await prisma.org.findFirstOrThrow()

    const response = await request(app.server)
      .get(`/orgs/${org.id}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(expect.objectContaining({
      name: 'Organization X',
      whatsapp: '(32)99900-1100'
    }))
  })
})
