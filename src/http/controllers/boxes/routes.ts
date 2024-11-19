import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { FastifyInstance } from "fastify";
import { CreateBox } from "./create/create-boxes-controller";
import { UpdateBox } from "./update/update-boxes-controller";
import { DeleteBox } from "./delete/delete-boxes-controller";
import { ListBoxes } from "./list/list-boxes-controller";
import { FindByIdBox } from "./find-by-id/find-by-id-boxes-controller";

export async function boxesRoutes(fastifyApp: FastifyInstance){

    // criar box
    fastifyApp.post('/', CreateBox),
    
    // update box
    fastifyApp.put('/', UpdateBox)

    // delete box
    fastifyApp.delete('/:id', DeleteBox)

    // list box
    fastifyApp.get('/', ListBoxes)

    // find box by id
    fastifyApp.get('/:id', FindByIdBox)
}