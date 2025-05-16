import { IMailProvider } from "@/providers/MailProvider/interface-mail-provider";
import { IUsersRepository } from "@/repositories/interfaces/interface-users-repository";
import { formatPhoneNumber } from "@/utils/format-cellphone";
import { env } from "process";

export interface IRequestContactUs {
    name: string;
    email: string;
    phone: string;
    subject: 'DUVIDA' | 'SUGESTAO' | 'RECLAMACAO' | 'OUTRO';
    message: string;
}

export class ContactUsUseCase {
    constructor(
        private mailProvider: IMailProvider,
        private userRepository: IUsersRepository
    ){}
    async execute({
        name,
        email,
        phone,
        subject,
        message
    }: IRequestContactUs) {
        const phoneFormatted = formatPhoneNumber(phone)

         // pegar template de verificaçao de email
        const pathTemplate =
            env.NODE_ENV === 'development'
            ? './views/emails/contact-us.hbs'
            : './build/views/emails/contact-us.hbs'

        
        const admins = await this.userRepository.listAdmins()

        for(const admin of admins){
            await this.mailProvider.sendEmail(
                admin.email, 
                admin.name, 
                'Novo contato recebido através do site',
                null,
                pathTemplate,
                {
                    contact: {
                        name,
                        email,
                        phone: phoneFormatted,
                        subject,
                        message
                    }
                }
            )
        }
    }
}