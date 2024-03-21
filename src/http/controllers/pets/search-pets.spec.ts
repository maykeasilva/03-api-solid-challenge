import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { createAndAuthenticateOrg } from '@/utils/test/create-and-authenticate-org'

describe('Search Pets (e2e)', () => {
  let token: string

  beforeAll(async () => {
    await app.ready()
    
    const authResponse = await createAndAuthenticateOrg(app)
    token = authResponse.token
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search pets', async () => {
    await request(app.server)
      .post('/orgs/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Ruby',
        about: 'More about the pet',
        age: 'puppy',
        size: 'small',
        energyLevel: 'very low',
        independenceLevel: 'low',
        environment: 'small',
      })

    await request(app.server)
      .post('/orgs/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Rust',
        about: 'More about the pet',
        age: 'adult',
        size: 'medium',
        energyLevel: 'high',
        independenceLevel: 'medium',
        environment: 'medium',
      })

    const response = await request(app.server)
      .get('/pets/search')
      .query({
        state: 'MG',
        city: 'Belo Horizonte',
        size: 'small',
      })
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.pets).toHaveLength(1)
    expect(response.body.pets).toEqual([expect.objectContaining({ name: 'Ruby' })])
  })

  it('should be able to fetch paginated search pets', async () => {
    for (let i = 1; i <= 22; i++) {
      await request(app.server)
        .post('/orgs/pets')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: `Pet ${i}`,
          about: 'More about the pet',
          age: 'puppy',
          size: 'small',
          energyLevel: 'very low',
          independenceLevel: 'low',
          environment: 'small',
        })
    }

    const response = await request(app.server)
      .get('/pets/search')
      .query({
        state: 'MG',
        city: 'Belo Horizonte',
        size: 'small',
        page: 2,
      })
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.pets).toHaveLength(3)
    expect(response.body.pets).toEqual([
      expect.objectContaining({ name: 'Pet 2' }),
      expect.objectContaining({ name: 'Pet 1' }),
      expect.objectContaining({ name: 'Ruby' }), // First pet registered in the test above
    ])
  })
})
