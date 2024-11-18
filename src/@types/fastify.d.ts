// fastify.d.ts
import { FastifyRequest } from 'fastify';
import File from '@/lib/interfaces'

declare module 'fastify' {
  interface FastifyRequest {
    // files: File
    user:{
      id: string;
      shoppingCartId: string;
      role: Role ;
    }
    melhorEnvio: {
      accessToken: string;
      refreshToken: string;
    }
  }
}
