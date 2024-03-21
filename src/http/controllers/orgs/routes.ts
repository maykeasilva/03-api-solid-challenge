import { FastifyInstance } from 'fastify'

import { registerOrg } from './register-org'
import { authenticateOrg } from './authenticate-org'
import { refresh } from './refresh'
import { getOrgProfile } from './get-org-profile'
import { fetchNearbyOrgs } from './fetch-nearby-orgs'

export async function orgsRoutes(app: FastifyInstance) {
  app.get('/orgs/:orgId', getOrgProfile)
  app.get('/orgs/nearby', fetchNearbyOrgs)
  
  app.post('/orgs', registerOrg)
  app.post('/orgs/sessions', authenticateOrg)

  app.patch('/token/refresh', refresh)
}
