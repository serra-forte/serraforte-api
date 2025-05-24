import { MelhorEnvioProvider } from "@/providers/DeliveryProvider/implementations/provider-melhor-envio"
import { MailProvider } from "@/providers/MailProvider/implementations/provider-sendgrid"
import { RailwayProvider } from "@/providers/RailwayProvider/implementations/provider-railway"
import { PrismaAddressesRepository } from "@/repositories/prisma/prisma-addresses-repository"
import { PrismaStoreRepository } from "@/repositories/prisma/prisma-store-repository"
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { CreateStoreUseCase } from "@/usecases/stores/create/create-store-usecase"

export async function makeCreateStore(): Promise<CreateStoreUseCase> {
    const railwayProvider = new RailwayProvider()
    const mailProvider = new MailProvider()
    const userRepository = new PrismaUsersRepository()
    const melhorEnvioProvider = new MelhorEnvioProvider(railwayProvider, mailProvider, userRepository)
    const storeRepository = new PrismaStoreRepository()
    const addressRepository = new PrismaAddressesRepository()
    const createStoreUseCase = new CreateStoreUseCase(melhorEnvioProvider, storeRepository, addressRepository)
    return createStoreUseCase
}