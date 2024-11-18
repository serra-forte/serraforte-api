import { IDateProvider } from "@/providers/DateProvider/interface-date-provider";
import { hash } from "bcrypt";
import { User } from "@prisma/client";
import { AppError } from "@/usecases/errors/app-error";
import { IUsersRepository } from "@/repositories/interfaces/interface-users-repository";
import { ITokensRepository } from "@/repositories/interfaces/interface-tokens-repository";

interface IRequestResetPassword {
    token: string
    password: string
}

export class ResetPasswordUseCase{
    constructor(
        private usersRepository: IUsersRepository,
        private usersTokensRepository: ITokensRepository,
        private dayjsDateProvider: IDateProvider,
    ) {}

    async execute({
        token,
        password
    }:IRequestResetPassword):Promise<void>{
        // buscar token no banco
        const findToken = await this.usersTokensRepository.findByToken(token)

        // verifica se token foi encontrado
        if(!findToken){
            throw new AppError('Token não encontrado', 404)
        }

        // verificar se o token está expirado
        if  (
                this.dayjsDateProvider.compareIfBefore
                (
                    findToken.expireDate, 
                    this.dayjsDateProvider.dateNow()
                )
            )
        {
            throw new AppError('Token expirado', 401)
        }

        // buscar usuário no banco
        const user = await this.usersRepository.findById(findToken.userId) as User
        
        // criptografar senha
        const newPassword = await hash(password, 8)

        // chamar metodo de atualizar senha
        await this.usersRepository.changePassword(user.id, newPassword)
        
        // deletar token do banco
        await this.usersTokensRepository.delete(findToken.id)
    }
}