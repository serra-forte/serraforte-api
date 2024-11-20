import { IRailwayProvider } from "@/providers/RailwayProvider/interface-railway-provider"

interface IRequestRefreshTokenMelhorEnvio {
    refreshToken: string
    token: string
}

export class RefreshTokenMelhorEnvioUseCase {
    constructor(
        private railwayProvider: IRailwayProvider
    ){}
    async execute({refreshToken, token}: IRequestRefreshTokenMelhorEnvio): Promise<void>{
        // atualziar o refresh token e token do melhor envio no railway
        await this.railwayProvider.variablesUpsert([
            {
                name: 'MELHOR_ENVIO_REFRESH_TOKEN',
                value: refreshToken
            },
            {
                name: 'MELHOR_ENVIO_TOKEN',
                value: token
            }
        ])
    }
}