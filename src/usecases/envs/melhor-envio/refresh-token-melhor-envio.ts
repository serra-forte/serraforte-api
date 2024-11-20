import { IRailwayProvider, ResponseUpsertVariables } from "@/providers/RailwayProvider/interface-railway-provider"

interface IRequestRefreshTokenMelhorEnvio {
    refreshToken: string
    token: string
}

export class RefreshTokenMelhorEnvioUseCase {
    constructor(
        private railwayProvider: IRailwayProvider
    ){}
    async execute({refreshToken, token}: IRequestRefreshTokenMelhorEnvio): Promise<ResponseUpsertVariables>{
        // atualziar o refresh token e token do melhor envio no railway
        const response = await this.railwayProvider.variablesUpsert([
            {
                name: 'MELHOR_ENVIO_REFRESH_TOKEN',
                value: refreshToken
            },
            {
                name: 'MELHOR_ENVIO_ACCESS_TOKEN',
                value: token
            }
        ])

        return response
    }
}