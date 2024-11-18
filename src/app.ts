import fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import fastifyCors from '@fastify/cors'
import "dotenv/config";
import fastifyMultipart from "@fastify/multipart";
import { usersRoutes } from "./http/controllers/users/routes";
import { ZodError } from "zod";
import { env } from "@/env";
import urlEncodede from '@fastify/formbody'
import { addressRoutes } from "./http/controllers/address/router";
import { AppError } from "./usecases/errors/app-error";
import rateLimiter from '@fastify/rate-limit'
import { authRoutes } from "./http/controllers/auth/route";
import { imageRoutes } from "./http/controllers/images/router";
import { categoriesRoutes } from "./http/controllers/categories/routes";
import { usersAdminRoutes } from "./http/controllers/admin/routes-admin";
import cookie from '@fastify/cookie'
import { productsRoutes } from "./http/controllers/products/routes";
import { cartItemsRoutes } from "./http/controllers/cart-items/routes";
import { shoppingCartRoutes } from "./http/controllers/shopping-carts/routes";
import { ordersRoutes } from "./http/controllers/orders/routes";
import { deliveriesRoutes } from "./http/controllers/deliveries/routes";

export const fastifyApp = fastify()

fastifyApp.register(fastifyCors, {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
})

fastifyApp.register(cookie, {
  secret: env.COOKIE_SECRET,
  // hook: 'preHandler'
})

if(env.NODE_ENV === 'production'){
  fastifyApp.register(rateLimiter, {
    max: 15,
    timeWindow: '10 second'
  })
}

fastifyApp.register(fastifyMultipart, {
  attachFieldsToBody: true,
})

fastifyApp.register(urlEncodede)

fastifyApp.register(usersRoutes,{
    prefix: 'users'
})

fastifyApp.register(addressRoutes,{
  prefix: 'address'
})

fastifyApp.register(authRoutes,{
  prefix: 'auth'
})

fastifyApp.register(imageRoutes,{
  prefix: 'images'
})

fastifyApp.register(categoriesRoutes,{
  prefix: 'categories'
})

fastifyApp.register(productsRoutes,{
  prefix: 'products'
})

fastifyApp.register(usersAdminRoutes, {
  prefix: 'admins',
})

fastifyApp.register(cartItemsRoutes, {
  prefix: 'cart-items',
})

fastifyApp.register(shoppingCartRoutes, {
  prefix: 'shopping-carts',
})

fastifyApp.register(ordersRoutes, {
  prefix: 'orders',
})

fastifyApp.register(deliveriesRoutes, {
  prefix: 'deliveries',
})


fastifyApp.setErrorHandler((error:FastifyError,request:FastifyRequest, reply: FastifyReply)=>{
  if(env.NODE_ENV !== 'production'){
  }else{
    if(error instanceof AppError){
      // fastifyApp.Sentry.captureException(Error(error.message))
    }else{
      // fastifyApp.Sentry.captureException(error)
    }
  }

  if(error instanceof ZodError){
    return reply.status(400).send({message: 'Campo inválido', issues: error.format()})
  }

  if(error instanceof AppError){
    return reply.status(error.statusCode).send({message: error.message})
  }

  if(error.statusCode === 429){
    return reply.status(429).send({message: 'Muitas requisições para o mesmo IP'})
  }
  console.log(error)
  return reply.status(500).send({message: error.message})
})
