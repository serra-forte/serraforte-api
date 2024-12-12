import { z } from "zod";
import 'dotenv/config'

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(3333),
    HOST: z.string().default('0.0.0.0'),
    DATABASE_URL: z.string(),
    JWT_SECRET_ACCESS_TOKEN: z.string(),
    JWT_SECRET_REFRESH_TOKEN: z.string(),
    JWT_EXPIRES_IN_REFRESH_TOKEN: z.string(),
    JWT_EXPIRES_IN_ACCESS_TOKEN: z.string(),
    COOKIE_SECRET: z.string(),
    SENDGRID_API_KEY: z.string(),
    APP_URL_DEVLOPMENT: z.string().optional(),
    APP_URL_PRODUCTION: z.string().optional(),
    REDIS: z.string(),
    CHARACTERS: z.string(),
    ASAAS_API_URL: z.string(),
    ASAAS_PAYMENT_TOKEN: z.string(),
    FIREBASE_PROJECT_ID: z.string(),
    FIREBASE_CLIENT_EMAIL: z.string().email(),
    FIREBASE_PRIVATE_KEY: z.string(),
    FIREBASE_BUCKET: z.string(),
    FOLDER_TMP_DEVELOPMENT: z.string(),
    FOLDER_TMP_PRODUCTION: z.string(),
    APP_URL_FRONTEND_DEVELOPMENT: z.string(),
    APP_URL_FRONTEND_PRODUCTION: z.string(),
    MELHOR_ENVIO_API_URL: z.string(),
    MELHOR_ENVIO_CLIENT_ID: z.string(),
    MELHOR_ENVIO_CLIENT_SECRET: z.string(),
    MELHOR_REDIRECT_URI: z.string(),
    MELHOR_ENVIO_ACCESS_TOKEN: z.string(),
    MELHOR_ENVIO_REFRESH_TOKEN: z.string(),
    MELHOR_ENVIO_TRANCKING_LINK: z.string(),
    RAILWAY_API_URL: z.string(),
    RAILWAY_TOKEN: z.string(),
    RAILWAY_PROJECT_ID: z.string(),
    RAILWAY_ENVIRONMENT_ID: z.string(),
    RAILWAY_SERVICE_ID: z.string(),
    KAFKA_PRIVATE_URL: z.string(),
})

const _env = envSchema.safeParse(process.env)

if(_env.success !== true){
    console.error('Error converting environment variables', _env.error.format())

  throw new Error('Invalid environment variables')
}

export const env = _env.data