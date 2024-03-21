import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'

describe('Register Org (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register an organization', async () => {
    const response = await request(app.server).post('/orgs').send({
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

    expect(response.statusCode).toEqual(201)
  })
})
