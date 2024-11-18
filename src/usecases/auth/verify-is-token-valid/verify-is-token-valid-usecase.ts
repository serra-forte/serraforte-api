import { ICacheProvider } from "@/providers/CacheProvider/interface-cache"

interface IRequestVerifyToken{
    accessToken: string
}

export class VerifyTokenIsValidUseCase {
    constructor(
        private cacheProvider: ICacheProvider
        ) {}

    async execute({
        accessToken
    }: IRequestVerifyToken): Promise<boolean>{
        // verificar se o token é valido
        const token = await this.cacheProvider.isTokenInBlackList(accessToken)
      
        // se o token for valido, retornar true
        if(!token){
            return false
        }

        return true
    }
}