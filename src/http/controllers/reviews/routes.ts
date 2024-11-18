import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt"
import { FastifyInstance } from "fastify"
import { CreateReviews } from "./create/create-reviews-controller"
import { DeleteReviews } from "./delete/delete-reviews-controller"
import { UpdateReviews } from "./update/update-reviews-controller"
import { FindByIdReviews } from "./find-by-id/find-by-id-reviews-controller"
import { ListReviews } from "./list/list-reviews-controller"
import { ApproveReviews } from "./approve/approve-reviews-controller"
import { verifyUserRole } from "@/http/middlewares/verify-user-role"
import { CountByCreated } from "./count-by-created/count-by-created-reviews-controller"

export async function reviewsRoutes(fastifyApp: FastifyInstance) {
    // criar review
    fastifyApp.post('/', {
        onRequest: [verifyTokenJWT],
        config:{
            rateLimit:{
                max: 10,
                timeWindow: '1 minute'
            }
        }
    }, CreateReviews)

    // delete review
    fastifyApp.delete('/:id', DeleteReviews)

    // buscar review pelo id
    fastifyApp.get('/:id', {
        onRequest: [verifyTokenJWT],
        config:{
            rateLimit:{
                max: 10,
                timeWindow: '1 minute'
            }
        }
    }, FindByIdReviews)

    // atualizar review
    fastifyApp.put('/:id', {
        config:{
            rateLimit:{
                max: 10,
                timeWindow: '1 minute'
            }
        }
    }, UpdateReviews)

    // listar reviews
    fastifyApp.get('/',{
        onRequest: [verifyTokenJWT]
    }, ListReviews)

    // approvar review
    fastifyApp.patch('/approve',{
        onRequest: [verifyTokenJWT, verifyUserRole('ADMIN', 'SUPER', 'SHOPKEEPER')]
    }, ApproveReviews)

    // contador de reviews criadas
    fastifyApp.get('/count',{
        onRequest: [verifyTokenJWT, verifyUserRole('GUEST',  'ADMIN', 'SUPER', 'SHOPKEEPER')]
    }, CountByCreated)
}
