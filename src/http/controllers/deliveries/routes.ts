import { FastifyInstance } from "fastify";
import { Authorize } from "../deliveries/melhor-envio/authorize/authorize-melhor-envio-controller";
import { Authenticate } from "../deliveries/melhor-envio/authenticate/authenticate-melhor-envio-controller";
import { ShipmentCalculate } from "./melhor-envio/shipment-calculate/shipment-calculate-melhor-envio";
import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt";
import { WebHookGetStatusLabel } from "./melhor-envio/webhooks/get-status-label-controller";

export async function deliveriesRoutes(fastifyApp: FastifyInstance) {
    // ===== Melhor Envio =====
    fastifyApp.post('/melhor-envio/authorize', {
        onRequest: []
    }, Authorize)

    fastifyApp.post('/melhor-envio/authenticate', {
        onRequest: []
    }, Authenticate)

    fastifyApp.post('/melhor-envio/shipment-calculate/checkout', {
        onRequest: [
            verifyTokenJWT        
        ],
    }, ShipmentCalculate)

    // ===== Webhooks =====
    fastifyApp.post('/melhor-envio/webhooks/get/status/label', {
        onRequest: []
    }, WebHookGetStatusLabel)
}