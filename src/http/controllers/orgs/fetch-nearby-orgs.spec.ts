import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'

describe('Fetch Nearby Orgs (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch nearby orgs', async () => {
    // Organization Near
    await request(app.server).post('/orgs').send({
      name: 'Organization Near',
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
    // Organization Far
    await request(app.server).post('/orgs').send({
      name: 'Organization far',
      personResponsible: 'Joe Bloggs',
      email: 'joebloggs@example.com',
      password: '123456',
      whatsapp: '(32)99911-0011',
      cep: '20090-908',
      state: 'RJ',
      city: 'Rio de Janeiro',
      street: 'Av. Rio Branco',
      neighborhood: 'Centro',
      number: '222',
      latitude: -22.904039,
      longitude: -43.178081,
    })

    const response = await request(app.server)
      .get('/orgs/nearby')
      .query({
        latitude: -19.924558,
        longitude: -43.935368,
      })
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.orgs).toEqual([expect.objectContaining({ name: 'Organization Near' })])
  })
})
