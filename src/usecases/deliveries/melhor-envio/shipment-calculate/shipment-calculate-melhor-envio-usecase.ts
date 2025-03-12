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
export class ShipmentCalculateDeliveriesUseCase {
    constructor(
        private melhorEnvioProvider: IMelhorEnvioProvider,
        private userRepository: IUsersRepository,
        private productsRepository: IProductsRepository,
        private shoppingCartRepository: IShoppingCartRepository
    ) {}

    async execute({
        userId,
        to, 
    }: IRequestShipmentCalculate): Promise<IResponseCalculateShipping[]> {
        const shipmentResults: IResponseCalculateShipping[] = [];

        const findShopingCart = await this.shoppingCartRepository.findByUserId(userId);

        if (!findShopingCart) {
            throw new AppError(`Carrinho não encontrado`, 404);
        }

        // Buscar lojista pelo ID
        const findShopkeeper = await this.userRepository.findById('shopkeeperId') as unknown as IUserRelations;

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


        return shipmentResults;
    }
}
