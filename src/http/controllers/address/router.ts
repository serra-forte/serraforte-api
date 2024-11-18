import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt"
import { FastifyInstance } from "fastify"
import { CreateAddress } from "./create/create-address-controlle"
import { UpdateAddress } from "./update-full/update-address-controlle"

export async function addressRoutes(fastifyApp: FastifyInstance) {
    fastifyApp.addHook('onRequest', verifyTokenJWT)

    // criar address
    fastifyApp.post('/', CreateAddress)

    // atualizar um address pelo id
    fastifyApp.put('/', UpdateAddress)
}
