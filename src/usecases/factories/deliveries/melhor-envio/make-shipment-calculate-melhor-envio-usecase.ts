import { MelhorEnvioProvider } from "@/providers/DeliveryProvider/implementations/provider-melhor-envio"
import { MailProvider } from "@/providers/MailProvider/implementations/provider-sendgrid"
import { RailwayProvider } from "@/providers/RailwayProvider/implementations/provider-railway"
import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository"
import { PrismaShoppingCartRepository } from "@/repositories/prisma/prisma-shopping-cart-repository"
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { ShipmentCalculateDeliveriesUseCase } from "@/usecases/deliveries/melhor-envio/shipment-calculate/shipment-calculate-melhor-envio-usecase"

export async function makeShipmentCalculate(): Promise<ShipmentCalculateDeliveriesUseCase>{
    const railwayProvider = new RailwayProvider()
    const mailProvider = new MailProvider()
    const userRepository = new PrismaUsersRepository()
    const melhorEnvioProvider = new MelhorEnvioProvider(railwayProvider, mailProvider, userRepository)
    const shoppingCartRepository = new PrismaShoppingCartRepository()

    const shipmentCalculateDeliveriesUseCase  = new ShipmentCalculateDeliveriesUseCase(
        melhorEnvioProvider,
        userRepository,
        shoppingCartRepository
    )
    
    return shipmentCalculateDeliveriesUseCase 
}