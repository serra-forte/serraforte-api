import { IUserRelations } from "@/dtos/user-relations.dto";
import { IMelhorEnvioProvider, IProduct, IResponseCalculateShipping } from "@/providers/DeliveryProvider/interface-melhor-envio-provider";
import { IProductsRepository } from "@/repositories/interfaces/interface-products-repository";
import { IUsersRepository } from "@/repositories/interfaces/interface-users-repository";
import { AppError } from "@/usecases/errors/app-error";

export interface IRequestShipmentCalculate {
    shopkeeperIds: string[]
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
        shopkeeperIds, 
        to, 
        productsId
    }: IRequestShipmentCalculate): Promise<IResponseCalculateShipping[]> {
        const shipmentResults: IResponseCalculateShipping[] = [];

        for (let shopkeeperId of shopkeeperIds) {
            // Buscar lojista pelo ID
            const findShopkeeper = await this.userRepository.findById(shopkeeperId) as unknown as IUserRelations;

            // Validar se lojista existe
            if (!findShopkeeper) {
                throw new AppError(`Lojista com ID ${shopkeeperId} não encontrado`, 404);
            }

            // Filtrar produtos pertencentes ao lojista atual
            const products = await Promise.all(
                productsId.map(async (id) => {
                    const responseProduct = await this.productsRepository.findById(id) ;
                    if (!responseProduct || !responseProduct.product) {
                        throw new AppError(`Produto com ID ${id} não encontrado`, 404);
                    }

                    // Verificar se o produto pertence ao lojista atual
                    if (responseProduct.product.user.id !== shopkeeperId) {
                        return null;
                    }

                    return responseProduct.product;
                })
            ).then((res) => res.filter(Boolean)); // Remover valores `null`

            if (products.length === 0) {
                throw new AppError(`Nenhum produto encontrado para o lojista com ID ${shopkeeperId}`, 404);
            }

            // Calcular envio para os produtos do lojista atual
            const shipmentCalculate = await this.melhorEnvioProvider.shipmentCalculate({
                to: {
                    postal_code: to,
                },
                from: {
                    postal_code: findShopkeeper.address.zipCode as string,
                },
                products: products.map(product => ({
                    id: product?.id,
                    quantity: Number(product?.quantity),
                    width: Number(product?.width),
                    height: Number(product?.height),
                    length: Number(product?.length),
                    weight: Number(product?.weight),
                    insurance_value: 0,
                })) as IProduct[],
            });

            if (shipmentResults.length === 0) {
                shipmentResults.push(...shipmentCalculate);
            } else {
                for (const freight of shipmentCalculate) {
                    const existingFreight = shipmentResults.find(result => result.name === freight.name);
            
                    if (existingFreight) {
                        existingFreight.price += freight.price;
                        if (existingFreight.delivery_time < freight.delivery_time) {
                            existingFreight.delivery_time = freight.delivery_time;
                        }
                    } else {
                        shipmentResults.push(freight);
                    }
                }
            }

        }

        return shipmentResults;
    }
}
