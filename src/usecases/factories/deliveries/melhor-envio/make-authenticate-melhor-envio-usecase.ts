import { MelhorEnvioProvider } from "@/providers/DeliveryProvider/implementations/provider-melhor-envio"
import { RailwayProvider } from "@/providers/RailwayProvider/implementations/provider-railway"
import { AuthenticateMelhorEnvioUsecase } from "@/usecases/deliveries/melhor-envio/authenticate/authenticate-melhor-encio-usecase"

export async function makeAuthenticate(): Promise<AuthenticateMelhorEnvioUsecase>{
        const railwayProvider = new RailwayProvider()
        const melhorEnvioProvider = new MelhorEnvioProvider(railwayProvider)

        const authenticateMelhorEnvioUsecase  = new AuthenticateMelhorEnvioUsecase(
            melhorEnvioProvider
        )
        return authenticateMelhorEnvioUsecase 
}