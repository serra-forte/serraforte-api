import { IResponseAuth } from './../../../../providers/DeliveryProvider/interface-melhor-envio-provider';
import { IMelhorEnvioProvider } from "@/providers/DeliveryProvider/interface-melhor-envio-provider";

export interface IRequestAuthenticate{
    code: string
}

export class AuthenticateMelhorEnvioUsecase {
    constructor(
        private melhorEnvioProvider: IMelhorEnvioProvider
    ) {}
    async execute({code}: IRequestAuthenticate): Promise<IResponseAuth> {
        const response = await this.melhorEnvioProvider.authorization(code)

        return response
    }
}