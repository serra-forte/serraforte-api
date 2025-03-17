import { IUserRelations } from "@/dtos/user-relations.dto";
import { IMelhorEnvioProvider, IProduct, IResponseCalculateShipping } from "@/providers/DeliveryProvider/interface-melhor-envio-provider";
import { IProductsRepository } from "@/repositories/interfaces/interface-products-repository";
import { IShoppingCartRepository } from "@/repositories/interfaces/interface-shopping-cart-repository";
import { IUsersRepository } from "@/repositories/interfaces/interface-users-repository";
import { AppError } from "@/usecases/errors/app-error";

export interface IRequestShipmentCalculate {
    userId: string;
    to: string
}

interface IResponseShipmentCalculate{
    id: number
    name: string
    price: string
    delivery_time: number
    company: {
        id: number
        name: string
    }
}
export class ShipmentCalculateDeliveriesUseCase {
    constructor(
        private melhorEnvioProvider: IMelhorEnvioProvider,
        private userRepository: IUsersRepository,
        private shoppingCartRepository: IShoppingCartRepository
    ) {}

    async execute({
        userId,
        to, 
    }: IRequestShipmentCalculate): Promise<IResponseShipmentCalculate[]> {
        const shipmentResults: IResponseShipmentCalculate[] = [];

        const findShopingCart = await this.shoppingCartRepository.findByUserId(userId);

        if (!findShopingCart) {
            throw new AppError(`Carrinho não encontrado`, 404);
        }

        const uniqueUserIds = [...new Set(findShopingCart.cartItem.map(item => item.userId))];

        for(const shopkeeperId of uniqueUserIds) {
            // Buscar lojista pelo ID
            const findShopkeeper = await this.userRepository.findById(shopkeeperId) as unknown as IUserRelations;

            // Validar se lojista existe
            if (!findShopkeeper) {
             throw new AppError(`Lojista não encontrado`, 404);
            }

            // Calcular envio para os produtos do lojista atual
            const shipmentCalculate = await this.melhorEnvioProvider.shipmentCalculate({
                to: {
                    postal_code: to,
                },
                from: {
                    postal_code: findShopkeeper.address.zipCode as string,
                },
                products: findShopingCart.cartItem.map(product => ({
                    id: product.id,
                    quantity: product.quantity,
                    width: product.width,
                    height: product.height,
                    length: product.length,
                    weight: product.weight,
                    insurance_value: 0,
                })) as IProduct[],
            });


            if (shipmentResults.length === 0) {
                for(const freight of shipmentCalculate) {
                    shipmentResults.push({
                        id: freight.id,
                        name: freight.name,
                        price: freight.price,
                        delivery_time: freight.delivery_time,
                        company: freight.company
                    })
                }
            } else {
                for (const freight of shipmentCalculate) {
                    const existingFreight = shipmentResults.find(result => result.name === freight.name);
            
                    if (existingFreight) {
                        existingFreight.price += freight.price;
                        if (existingFreight.delivery_time < freight.delivery_time) {
                            existingFreight.delivery_time = freight.delivery_time;
                        }
                    } else {
                        shipmentResults.push({
                            id: freight.id,
                            name: freight.name,
                            price: freight.price,
                            delivery_time: freight.delivery_time,
                            company: freight.company
                        })
                    }
                }
            }
        }

        return shipmentResults;
    }
}
