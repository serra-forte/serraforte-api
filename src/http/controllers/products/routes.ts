import { FastifyInstance } from 'fastify'
import { CreateProduct } from './create/create-products-controller'
import { ListProduct } from './list/list-products-controller'
import { verifyTokenJWT } from '@/http/middlewares/verify-token-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { UpdateProduct } from './update/update-products-controller'
import { DeleteProduct } from './delete/delete-products-controller'
import { ListByCategoryProduct } from './list-by-category/list-by-category-products-controller'
import { FindProduct } from './find-by-id/find-by-id-categories-controller'
import { SearchProduct } from './search/search-products-controller'
import { FilterProduct } from './filter/filter-products-controller'
import { ListBySalesPublic } from './list-by-sales-public/list-public-products-controller'
import { ListBySalesPrivate } from './list-by-sales-private/list-private-products-controller'
export async function productsRoutes(fastifyApp: FastifyInstance) {
    // criar product (body)
    fastifyApp.post('/', {
        onRequest: 
        [verifyTokenJWT, verifyUserRole('ADMIN', 'SHOPKEEPER', 'SUPER')]}, 
    CreateProduct)

    // listar products (no-params)
    fastifyApp.get('/', {
        config:{
            rateLimit:{
              max: 200,
              timeWindow: '1 minute'
            }
        }
    }, ListProduct) 

    // listar products by category (query))
    fastifyApp.get('/category', {
        config:{
            rateLimit:{
              max: 200,
              timeWindow: '1 minute'
            }
        }
    }, ListByCategoryProduct)

    // atualizar um product pelo id (body)
    fastifyApp.put('/', 
        {onRequest: [verifyTokenJWT, verifyUserRole('ADMIN', 'SHOPKEEPER', 'SUPER')]}, 
    UpdateProduct)

    // deletar um product pelo id (params)
    fastifyApp.delete('/:id', {onRequest: 
        [verifyTokenJWT, verifyUserRole('ADMIN', 'SHOPKEEPER', 'SUPER')]}, 
    DeleteProduct)

    // product um product pelo id (params)
    fastifyApp.get('/find', FindProduct)

    // listar produtos mais vendidos publica
    fastifyApp.get('/sales', {
        config:{
            rateLimit:{
              max: 200,
              timeWindow: '1 minute'
            }
        }
    }, ListBySalesPublic)

    fastifyApp.get('/sales-private', {
        onRequest: [verifyTokenJWT, verifyUserRole('ADMIN', 'SHOPKEEPER', 'SUPER')],
        config:{
            rateLimit:{
              max: 200,
              timeWindow: '1 minute'
            }
        }
    }, ListBySalesPrivate)

     // buscar produto por palavra chave
     fastifyApp.get('/search/:keyword', SearchProduct )

    //  buscar produto usando fitro
     fastifyApp.get('/filter', FilterProduct)
}
