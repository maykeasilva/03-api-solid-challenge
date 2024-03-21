import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { createPet } from './create-pet'
import { getPetDetails } from './get-pet-details'
import { searchPets } from './search-pets'

export async function petsRoutes(app: FastifyInstance) {
  app.get('/pets/:petId', getPetDetails)
  app.get('/pets/search', searchPets)

  /** Authenticated */
  app.post('/orgs/pets', { onRequest: [verifyJWT] }, createPet)
}
