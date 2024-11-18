import { IProductsRepository, IResponseFindProductWithReviews } from "@/repositories/interfaces/interface-products-repository"
import { IUsersRepository } from "@/repositories/interfaces/interface-users-repository"
import { AppError } from "@/usecases/errors/app-error"
import { Product } from "@prisma/client"

export interface IRequestUpdateProducts {
    id: string
    name: string
    categoryId?: string | null
    description?: string | null
    shopKeeperId?: string | null
    price: number
    mainImage?: string | null
    quantity: number
    active: boolean
}

export class UpdateProductsUseCase {
    constructor(
        private productsRepository: IProductsRepository,
        private userRepository: IUsersRepository,
    ){}

    async execute({ 
        id,
        name, 
        categoryId, 
        shopKeeperId,
        description, 
        price, 
        mainImage, 
        quantity, 
        active
    }: IRequestUpdateProducts): Promise<Product> {
        // buscar produto pelo id
        const response =  await this.productsRepository.findById(id) as IResponseFindProductWithReviews

        const {
            product: productAlreadyExists
        } = response


        // validar se existe um produto com o mesmo id
        if(!productAlreadyExists){
            throw new AppError('Produto nao encontrado', 404)
        }

        // buscar produto pelo nome
        const nameProductAlreadyExists = await this.productsRepository.findByName(name)

        // validar se existe um produto com o mesmo nome
        if(nameProductAlreadyExists){
            if(productAlreadyExists.id !== nameProductAlreadyExists.id){
            throw new AppError('Produto ja existe', 409)
            }
        }

        if(shopKeeperId){
            // buscar usuario pelo id - lojista
            const findUserExists = await this.userRepository.findById(shopKeeperId as string)

            // validar se existe um usuario com o mesmo id
            if(!findUserExists){
                throw new AppError('Lojista invalido', 401)
            }

            // validar se o usuario e um lojista
            if(findUserExists){
                if(findUserExists.role !== 'SHOPKEEPER'){
                    throw new AppError('Lojista invalido', 401)
                }
            }
        }

        // criar produto
        const product = await this.productsRepository.update({
            id,
            name,
            description,
            user: shopKeeperId ? {
                connect :{
                    id: shopKeeperId as string
                }
            } : undefined,
            price,
            mainImage: mainImage as string ?? undefined,
            quantity,
            active,
            category: categoryId ? {
                connect: {
                    id: categoryId
                }
            } : undefined
        })

        // retornar produtos
        return  product 
       
    }
}