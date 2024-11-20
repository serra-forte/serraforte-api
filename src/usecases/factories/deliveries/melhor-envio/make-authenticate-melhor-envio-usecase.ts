import { MelhorEnvioProvider } from "@/providers/DeliveryProvider/implementations/provider-melhor-envio"
import { MailProvider } from "@/providers/MailProvider/implementations/provider-sendgrid"
import { RailwayProvider } from "@/providers/RailwayProvider/implementations/provider-railway"
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { AuthenticateMelhorEnvioUsecase } from "@/usecases/deliveries/melhor-envio/authenticate/authenticate-melhor-encio-usecase"

export async function makeAuthenticate(): Promise<AuthenticateMelhorEnvioUsecase>{
        const railwayProvider = new RailwayProvider()
        const mailProvider = new MailProvider()
        const userRepository = new PrismaUsersRepository()
        const melhorEnvioProvider = new MelhorEnvioProvider(railwayProvider, mailProvider, userRepository)

        const authenticateMelhorEnvioUsecase  = new AuthenticateMelhorEnvioUsecase(
            melhorEnvioProvider
        )
        return authenticateMelhorEnvioUsecase 
}