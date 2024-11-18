import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt"
import { verifyUserRole } from "@/http/middlewares/verify-user-role"
import { FastifyInstance } from "fastify"
import { CreateCategory } from "./create/create-categories-controller"
import { UpdateCategory } from "./update/update-categories-controller"
import { FindCategory } from "./find-by-id/find-by-id-categories-controller"
import { ListCategory } from "./list/list-categories-controller"
import { DeleteCategory } from "./delete/delete-by-id-categories-controller"

export async function categoriesRoutes(fastifyApp: FastifyInstance) {
    // criar categoria
    fastifyApp.post('/', CreateCategory)

    // find categoria pelo id
    fastifyApp.get('/:id', FindCategory)

    // list categoria pelo id
    fastifyApp.get('/', ListCategory)

    // update categoria
    fastifyApp.put('/', UpdateCategory)

    // delete categoria
    fastifyApp.delete('/:id', DeleteCategory)
}
