import { RailwayProvider } from "@/providers/RailwayProvider/implementations/provider-railway";
import { RefreshTokenMelhorEnvioUseCase } from "@/usecases/envs/melhor-envio/refresh-token-melhor-envio";

export async function makeRefreshTokenMelhorEnvio(): Promise<RefreshTokenMelhorEnvioUseCase>{
    const railwayProvider = new RailwayProvider()
    
    const refreshTokenMelhorEnvioUseCase  = new RefreshTokenMelhorEnvioUseCase(
        railwayProvider
    )
    
    return refreshTokenMelhorEnvioUseCase
}