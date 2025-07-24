import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL_DEV: z.string().optional(),
  VITE_NODE_ENV: z.enum(['development', 'production']),
  VITE_API_URL_PROD: z.string().optional(),
})

export const env = envSchema.parse(import.meta.env)
