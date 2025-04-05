import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { FastifyInstance } from "fastify";
import { DeleteImage } from "./delete/delete-images-controller";
import { UploadImage } from "./upload/upload-images-controller";
import { ListImageByUser } from "./list-by-user/list-by-user-images-controller";
import { ListImage } from "./list/list-images-controller";

export async function imageRoutes(fastifyApp: FastifyInstance) {
    fastifyApp.addHook('onRequest', verifyTokenJWT)
    // fastifyApp.addHook('onRequest', verifyUserRole('ADMIN', 'SUPER'))
    
    // upload de imagens
    fastifyApp.post('/', UploadImage)

    // listar imagens
    fastifyApp.get('/', ListImage)

    // listar imagens por usuário
    fastifyApp.get('/user/:id', ListImageByUser)

    // deletar imagem
    fastifyApp.delete('/:id', DeleteImage)
}
