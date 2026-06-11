import 'dotenv/config'
import { PrismaClient } from '../../generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { envVars } from '../config/env'

const adapter = new PrismaNeon({
  connectionString: envVars.DATABASE_URL
})

export const prisma = new PrismaClient({ adapter })