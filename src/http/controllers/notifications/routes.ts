import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt";
import { FastifyInstance } from "fastify";
import { ToggleIsReadNotification } from "./toggle-is-read/toggle-is-read-notifications-controller";

export async function notificationsRoutes(fastifyApp: FastifyInstance) {
    fastifyApp.addHook('onRequest', verifyTokenJWT)

    // alterar isRead da notifcação
    fastifyApp.patch('/', {
        onRequest: [verifyTokenJWT]
    }, ToggleIsReadNotification)
}
