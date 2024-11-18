import 'dotenv/config'
import { IDateProvider } from "@/providers/DateProvider/interface-date-provider";
import { randomUUID } from "crypto";
import { env } from "@/env";
import { IMailProvider } from "@/providers/MailProvider/interface-mail-provider";
import { AppError } from "@/usecases/errors/app-error";
import { ITokensRepository } from '@/repositories/interfaces/interface-tokens-repository';
import { IUsersRepository } from '@/repositories/interfaces/interface-users-repository';

interface IRequestForgotPasswordEmail {
    email: string
}

export class SendForgotPasswordUseCase{
    constructor(
        private usersRepository: IUsersRepository,
        private usersTokensRepository: ITokensRepository,
        private dayjsDateProvider: IDateProvider,
        private sendMailProvider: IMailProvider

    ) {}

    async execute({
        email
    }:IRequestForgotPasswordEmail):Promise<void>{
        // buscar usuario no banco pelo email
        const findUserByEmail = await this.usersRepository.findByEmail(email)

        // validar se usuario existe no banco
        if(!findUserByEmail){
            throw new AppError('Usuário não encontrado', 404)
        }

        if(findUserByEmail.softDelete){
            throw new AppError('Usuário não encontrado', 404)
        }

        // pegar caminho do arquivo handlebars forgot-password.hbs
        let pathTemplate = env.NODE_ENV === "development" ? 
        './views/emails/forgot-password.hbs':
        './build/views/emails/forgot-password.hbs' 

        // criar token com uuid
        const token = randomUUID()
         // criar data de expiração
        const expireDate = this.dayjsDateProvider.addHours(3)

        // salvar token no banco
        await this.usersTokensRepository.create({
            userId: findUserByEmail.id,
            expireDate,
            token
        })

        // criar o link para redeinir senha
        let link = env.NODE_ENV === "development" ?
        `${env.APP_URL_FRONTEND_DEVELOPMENT}/reset-password?token=${token}` :
        `${env.APP_URL_PRODUCTION}/reset-password?token=${token}`

        // enviar email com link de recuperação de senha
        await this.sendMailProvider.sendEmail(
            findUserByEmail.email, 
            findUserByEmail.name, 
            'Redefinição de Senha', 
            link, 
            pathTemplate,
            null
        )
    }
}