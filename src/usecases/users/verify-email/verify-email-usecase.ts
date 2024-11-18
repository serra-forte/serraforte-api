import { IDateProvider } from "@/providers/DateProvider/interface-date-provider";
import { ITokensRepository } from "@/repositories/interfaces/interface-tokens-repository";
import { IUsersRepository } from "@/repositories/interfaces/interface-users-repository";
import { AppError } from "@/usecases/errors/app-error";

interface IRequestVerifyEmail {
    token: string
    email: string
}

export class VerifyEmailUseCase{
    constructor(
        private usersRepository: IUsersRepository,
        private usersTokensRepository: ITokensRepository,
        private dayjsDateProvider: IDateProvider,
    ) {}

    async execute({
        token,
        email
    }:IRequestVerifyEmail):Promise<void>{
        const findUserByEmail = await this.usersRepository.findByEmail(email)

        if(!findUserByEmail){
            throw new AppError('Usuário não encontrado', 404)
        }

        const findToken = await this.usersTokensRepository.findByToken(token)

        if(!findToken){
            throw new AppError('Token não encontrado', 404)
        }

        //atualizar emailActive para true
        await this.usersRepository.activeEmail(findUserByEmail.id)
    }
}