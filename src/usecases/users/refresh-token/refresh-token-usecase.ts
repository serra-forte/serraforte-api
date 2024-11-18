import 'dotenv/config'
import { IDateProvider } from "@/providers/DateProvider/interface-date-provider";
import { sign, verify } from "jsonwebtoken";
import { env } from "@/env";
import { AppError } from '@/usecases/errors/app-error';
import { IPayload } from '@/http/middlewares/verify-token-jwt';
import { ITokensRepository } from '@/repositories/interfaces/interface-tokens-repository';
import { IUsersRepository } from '@/repositories/interfaces/interface-users-repository';
import { IUserRelations } from '@/dtos/user-relations.dto';

interface IRequestRefreshToken {
    token: string
}

interface IResponseRefreshToken {
    accessToken: string
}

export class RefreshTokenUseCase{
    constructor(
        private usersTokensRepository: ITokensRepository,
        private dayjsDateProvider: IDateProvider,
        private usersRepository: IUsersRepository
    ) {}

    async execute({
        token,
    }:IRequestRefreshToken):Promise<IResponseRefreshToken>{
        const userToken = await this.usersTokensRepository.findByToken(token)

        if(!userToken){
            throw new AppError('Refresh token não encontrado', 404)
        }
        
        const verifyToken = this.dayjsDateProvider.compareIfBefore(
            userToken.expireDate,
            this.dayjsDateProvider.dateNow()
             
            );
        // verificar se o token está expirado
        if(verifyToken)
            {
                // deletar refresh token do banco de dados
                await this.usersTokensRepository.delete(userToken.id)
                // gerar um novo refresh token passando email no payload

                throw new AppError('Refresh token expirado', 401)
            }
       
        verify(token, env.JWT_SECRET_REFRESH_TOKEN) as IPayload;

         // buscar usuário pelo id
         const user = await this.usersRepository.findById(userToken.userId) as unknown as IUserRelations

         // validar se o usuário existe
         if(!user){
             throw new AppError('Usuário não encontrado', 404)
         }

        // criar novo access token
        const newAccessToken = sign({role: user.role, shoppingCartId:user.shoppingCart.id}, env.JWT_SECRET_ACCESS_TOKEN, {
            subject: userToken.userId,
            expiresIn: env.JWT_EXPIRES_IN_ACCESS_TOKEN
        })
       
        
        // retornar o novo refresh token e o novo access token  
        return {
            accessToken: newAccessToken,
        }      
    }
}