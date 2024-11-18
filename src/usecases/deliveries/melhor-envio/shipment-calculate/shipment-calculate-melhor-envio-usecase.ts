import { env } from "@/env"
import { IMelhorEnvioProvider, IResponseCalculateShipping } from "@/providers/DeliveryProvider/interface-melhor-envio-provider"
import { IUsersRepository } from "@/repositories/interfaces/interface-users-repository"
import { AppError } from "@/usecases/errors/app-error"

export interface IRequestShipmentCalculate {
    shopkeeperId?: string | null
    to: string
}

export class ShipmentCalculateDeliveriesUseCase {
    constructor(
        private melhorEnvioProvider: IMelhorEnvioProvider,
        private userRepository: IUsersRepository
    ) {}

    async execute({
        shopkeeperId, 
        to, 
    }: IRequestShipmentCalculate): Promise<IResponseCalculateShipping[]> {
        // // buscar lojista pelo id
        // const findShopkeeper = await this.userRepository.findById(shopkeeperId)

        // // validar se lojista existe
        // if(!findShopkeeper || !findShopkeeper.shipmentCode) {
        //     throw new AppError('Lojista não encontrado', 404)
        // }

        const shipmentCalculate = await this.melhorEnvioProvider.shipmentCalculate({
            to:{
                postal_code: to
            },
            from:{
                postal_code: '16400140'
            },
        })

        return shipmentCalculate
    }
}