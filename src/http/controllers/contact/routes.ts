import { FastifyInstance } from "fastify";
import { ContactUs } from "./contact-us-controller";

export async function contactRoutes(fastifyApp: FastifyInstance) {
   fastifyApp.post('/us', ContactUs)
}