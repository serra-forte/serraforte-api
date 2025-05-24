import { FastifyInstance } from "fastify";
import { IsSystemUpdating } from "./is-system-updating/is-system-updating-controller";
import { HasErp } from "./has-erp/has-erp-controller";

export async function systemRoutes(fastifyApp: FastifyInstance) {
   fastifyApp.get('/status', IsSystemUpdating)
   fastifyApp.get('/erp', HasErp)
}