import { IProductRelationsDTO } from "@/dtos/product-relations.dto"
import { IUserRelations } from "@/dtos/user-relations.dto"
import { env } from "@/env"
import { IMelhorEnvioProvider, IResponseCalculateShipping } from "@/providers/DeliveryProvider/interface-melhor-envio-provider"
import { IProductsRepository } from "@/repositories/interfaces/interface-products-repository"
import { IUsersRepository } from "@/repositories/interfaces/interface-users-repository"
import { AppError } from "@/usecases/errors/app-error"
import { Product } from "@prisma/client"

export interface IRequestShipmentCalculate {
    shopkeeperId: string
    to: string
    productsId: string[]
}

export class ShipmentCalculateDeliveriesUseCase {
    constructor(
        private melhorEnvioProvider: IMelhorEnvioProvider,
        private userRepository: IUsersRepository,
        private productsRepository: IProductsRepository
    ) {}

    async execute({
        shopkeeperId, 
        to, 
        productsId
    }: IRequestShipmentCalculate): Promise<IResponseCalculateShipping[]> {
        // buscar lojista pelo id
        const findShopkeeper = await this.userRepository.findById(shopkeeperId) as unknown as IUserRelations

        // validar se lojista existe
        if(!findShopkeeper) {
            throw new AppError('Lojista não encontrado', 404)
        }

        // Buscar todos os produtos e preencher o array
        const products = await Promise.all(
            productsId.map(async (id) => {
                const responseProduct = await this.productsRepository.findById(id)
                if (!responseProduct) {
                    throw new AppError('Produto não encontrado', 404)
                }
                return responseProduct.product
            })
        )

        const shipmentCalculate = await this.melhorEnvioProvider.shipmentCalculate({
            to:{
                postal_code: to
            },
            from:{
                postal_code: findShopkeeper.address.zipCode as string
            },
            products: products.map(product =>{
                return{
                    id: product.id,
                    quantity: Number(product.quantity),
                    width: Number(product.width),
                    height: Number(product.height),
                    length: Number(product.length),
                    weight: Number(product.weight),
                    insurance_value: 0
                }
            })
        })

        return shipmentCalculate
    }
}