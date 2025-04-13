import { IUserRelations } from "@/dtos/user-relations.dto";
import { IMelhorEnvioProvider, IProduct, IResponseCalculateShipping } from "@/providers/DeliveryProvider/interface-melhor-envio-provider";
import { IShoppingCartRepository } from "@/repositories/interfaces/interface-shopping-cart-repository";
import { IUsersRepository } from "@/repositories/interfaces/interface-users-repository";
import { AppError } from "@/usecases/errors/app-error";

export interface IRequestShipmentCalculate {
    to: string
    products: {
        id: string
        quantity: number
        height: number
        width: number
        weight: number
        length: number
    }[]
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
        to, 
        products
    }: IRequestShipmentCalculate): Promise<IResponseShipmentCalculate[]> {
        const shipmentResults: IResponseShipmentCalculate[] = [];

        // Buscar lojista pelo ID
        const findShopkeeper = await this.userRepository.findShopkeeper() as unknown as IUserRelations;

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
                postal_code: findShopkeeper.address[0].zipCode as string,
            },
            products: products.map(product => ({
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

                if(freight.error){
                    continue 
                }

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

        return shipmentResults;
    }
}
