import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { FastifyInstance } from "fastify";
import { CreateBox } from "./create/create-boxes-controller";
import { UpdateBox } from "./update/update-boxes-controller";
import { DeleteBox } from "./delete/delete-boxes-controller";
import { ListBoxes } from "./list/list-boxes-controller";
import { FindByIdBox } from "./find-by-id/find-by-id-boxes-controller";

export async function boxesRoutes(fastify: FastifyInstance){
    fastify.addHook('onRequest', verifyTokenJWT)
    fastify.addHook('onRequest', verifyUserRole('SHOPKEEPER','ADMIN', 'SUPER'))

    // criar box
    fastify.post('/', CreateBox),
    
    // update box
    fastify.post('/', UpdateBox)

    // delete box
    fastify.delete('/:id', DeleteBox)

    // list box
    fastify.get('/', ListBoxes)

    // find box by id
    fastify.get('/:id', FindByIdBox)
}