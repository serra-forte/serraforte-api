import { env } from "@/env";
import { hash } from 'bcrypt'
import 'dotenv/config'
import { randomUUID } from "crypto";
import { IDateProvider } from "@/providers/DateProvider/interface-date-provider";
import { IMailProvider } from "@/providers/MailProvider/interface-mail-provider";
import { User } from "@prisma/client";
import { AppError } from "@/usecases/errors/app-error";
import { IUsersRepository } from "@/repositories/interfaces/interface-users-repository";
import { ITokensRepository } from "@/repositories/interfaces/interface-tokens-repository";

interface IRequestRegisterAccount {
    email: string,
    name: string,
    password: string,
    phone?: string | null,
    cpf?: string | null,
}

export class RegisterUseCase{
    constructor(
        private usersRepository: IUsersRepository,
        private dayjsDateProvider: IDateProvider,
        private usersTokensRepository: ITokensRepository,
        private sendMailProvider: IMailProvider,
    ) {}

    async execute({
        email,
        name,
        password,
        phone,
        cpf,
    }:IRequestRegisterAccount):Promise<User>{
        const findEmailAlreadyExists = await this.usersRepository.findByEmail(email)

        if(findEmailAlreadyExists){
            if(!findEmailAlreadyExists.softDelete){
                throw new AppError('Email já cadastrado', 409)
            }
            throw new AppError('Erro ao cadastrar usuário, tente novamente mais tarde', 409)
        }

        if(cpf){
            const findCPFAlreadyExist = await this.usersRepository.findByCPF(cpf)

            if(findCPFAlreadyExist){
                throw new AppError('CPF already exists!', 409)
            }
        }
        
        const criptingPassword = await hash(password, 8)
       
        const user = await this.usersRepository.create({
            email,
            name,
            password: criptingPassword,
            phone,
            cpf,
            shoppingCart:{
                create:{
                    expireDate: new Date(),
                    total: 0
                }
            },
        })

         // pegar template de verificaçao de email
         let pathTemplate = env.NODE_ENV === "development" ? 
         './views/emails/verify-email.hbs':
         './build/views/emails/verify-email.hbs' 
        
        // gerar token valido por 3h
        const token = randomUUID()
        // gerar data em horas
        const expireDateHours = this.dayjsDateProvider.addHours(3)

        // salvar token no banco
       await this.usersTokensRepository.create({
            userId: user.id,
            expireDate: expireDateHours,
            token
        })
        // formatar link com token
        const link =
        env.NODE_ENV === 'development'
        ? `${env.APP_URL_FRONTEND_DEVELOPMENT}/verification/${token}/${email}`
        : `${env.APP_URL_FRONTEND_PRODUCTION}/verification/${token}/${email}`

        // enviar verificação de emaill
        await this.sendMailProvider.sendEmail(
            email, 
            name,
            "Confirmação de email", 
            link, 
            pathTemplate,
            null
        )

        return user
    }
}