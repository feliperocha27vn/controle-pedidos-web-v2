import { env } from '@/env'
import axios from 'axios'

export const api = axios.create({
  baseURL:
    env.VITE_NODE_ENV === 'development'
      ? env.VITE_API_URL_DEV
      : env.VITE_API_URL_PROD,
})
