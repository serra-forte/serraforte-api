import fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import fastifyCors from '@fastify/cors';
import "dotenv/config";
import fastifyMultipart from "@fastify/multipart";
import { usersRoutes } from "./http/controllers/users/routes";
import { ZodError } from "zod";
import { env } from "@/env";
import urlEncodede from '@fastify/formbody';
import { addressRoutes } from "./http/controllers/address/router";
import { AppError } from "./usecases/errors/app-error";
import rateLimiter from '@fastify/rate-limit';
import { authRoutes } from "./http/controllers/auth/route";
import { imageRoutes } from "./http/controllers/images/router";
import { categoriesRoutes } from "./http/controllers/categories/routes";
import { usersAdminRoutes } from "./http/controllers/admin/routes-admin";
import cookie from '@fastify/cookie';
import { productsRoutes } from "./http/controllers/products/routes";
import { cartItemsRoutes } from "./http/controllers/cart-items/routes";
import { shoppingCartRoutes } from "./http/controllers/shopping-carts/routes";
import { ordersRoutes } from "./http/controllers/orders/routes";
import { deliveriesRoutes } from "./http/controllers/deliveries/routes";
import { boxesRoutes } from "./http/controllers/boxes/routes";
import { envRoutes } from "./http/controllers/envs/routes";
import handlebars from "handlebars";
import { tokensRoutes } from "./http/controllers/tokens/routes";
import { reviewsRoutes } from "./http/controllers/reviews/routes";
import { discountCouponRoutes } from "./http/controllers/discountCoupons/routes";
import { cancellationsRoutes } from "./http/controllers/cancellations/routes";
import { notificationsRoutes } from "./http/controllers/notifications/routes";
import { erpRoutes } from "./http/controllers/erp/routes";
import { systemRoutes } from "./http/controllers/system/routes";
import { contactRoutes } from "./http/controllers/contact/routes";
import { storeRoutes } from "./http/controllers/store/routes";

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

fastifyApp.register(boxesRoutes, {
  prefix: 'boxes',
})

fastifyApp.register(envRoutes, {
  prefix: 'envs',
})

fastifyApp.register(tokensRoutes, {
  prefix: 'tokens',
})

fastifyApp.register(reviewsRoutes, {
  prefix: 'reviews',
})

fastifyApp.register(discountCouponRoutes, {
  prefix: 'discount-coupons',
})

fastifyApp.register(cancellationsRoutes, {
  prefix: 'cancellations',
})

fastifyApp.register(notificationsRoutes, {
  prefix: 'notifications',
})

fastifyApp.register(erpRoutes, {
  prefix: 'erp',
})

fastifyApp.register(systemRoutes, {
  prefix: 'system',
})

fastifyApp.register(contactRoutes, {
  prefix: 'contact',
})

fastifyApp.register(storeRoutes, {
  prefix: 'stores',
})

// Registrar o helper equals sem usar 'this'
handlebars.registerHelper('isEqual', function (a, b) {
  return a === b;
});

handlebars.registerHelper('isNotNull', function(link) {
  return link && link !== "null";
});

// Registrar o helper formatNumber
handlebars.registerHelper('formatNumber', function (number) {
  return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
  }).format(Number(number));
});

// Registrar o helper formatCurrencyy
handlebars.registerHelper('formatCurrency', function (number, currencySymbol = '$') {
  // Verifica se o valor é um número e formata com duas casas decimais
  return `${currencySymbol} ${Number(number).toFixed(2)}`;
});

handlebars.registerHelper('formatPaymentMethod', (method: string) => {
  switch (method) {
    case 'PIX':
      return 'Pix';
    case 'CREDIT_CARD':
      return 'Cartão de Crédito';
    case 'BOLETO':
      return 'Boleto';
    default:
      return method;
  }
});


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
