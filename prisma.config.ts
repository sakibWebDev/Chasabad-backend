import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'
import {envVars} from "./src/app/config/env";

export default defineConfig({
  schema: 'prisma/schema/schema.prisma',
  datasource: {
    url: envVars.DIRECT_URL,
  },
})