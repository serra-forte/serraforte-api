import { ICategoriesRepository } from "@/repositories/interfaces/interface-categories-repository"
import { IProductsRepository } from "@/repositories/interfaces/interface-products-repository"
import { IUsersRepository } from "@/repositories/interfaces/interface-users-repository"
import { AppError } from "@/usecases/errors/app-error"
import { Product } from "@prisma/client"

export interface IRequestCreateProducts {
    erpProductId?: number | null
    name: string
    categoryId: string
    description?: string | null
    price: number
    mainImage?: string | null
    quantity: number
    active: boolean
    shopKeeperId: string
    weight: number
    height: number
    width: number
    length: number
}

export class CreateProductsUseCase {
    constructor(
        private productsRepository: IProductsRepository,
        private categoriesRepository: ICategoriesRepository,
        private usersRepository: IUsersRepository,
    ){}

    async execute({ 
        erpProductId,
        name, 
        categoryId, 
        description, 
        price, 
        mainImage, 
        quantity,
        active,
        weight,
        height,
        width,
        length,
        shopKeeperId: userId
     }: IRequestCreateProducts): Promise<Product> {
        if(erpProductId){
            const findProductErpExist = await this.productsRepository.findByErpProductId(erpProductId)

            // validar se existe um produto com o mesmo erpProductId
            if(findProductErpExist){
                throw new AppError('Produto ja existe', 409)
            }
        }
        
        // buscar categoria pelo id
        const findCategoryExists = await this.categoriesRepository.findById(categoryId as string)

        // validar se existe categoria com o mesmo id
        if(!findCategoryExists){
            throw new AppError('Categoria nao encontrada', 404)
        }

        // busca usuario pelo id - lojista
        const findUserExists = await this.usersRepository.findById(userId)

        // validar se existe um usuario com o mesmo id
        if(!findUserExists){
            throw new AppError('Usuario não encontrado', 404)
        }

        // buscar produto pelo nome
        const productAlreadyExists = await this.productsRepository.findByName(name)

        // validar se existe um produto com o mesmo nome
        if(productAlreadyExists){
            throw new AppError('Produto ja existe', 409)
        }

        // criar produto
        const product = await this.productsRepository.create({
            erpProductId,
            name,
            description,
            price,
            mainImage: mainImage as string ?? null,
            quantity,
            active,
            weight,
            height,
            width,
            length,
            user:{ // conectar o produto que pertence ao usuario
                connect: {
                    id: findUserExists.id
                }
            },
            category: { // conectar o produto que pertence a categoria
                connect: {
                    id: findCategoryExists.id
                }
            },
        })

        // retornar produtos
        return  product 
       
    }
}