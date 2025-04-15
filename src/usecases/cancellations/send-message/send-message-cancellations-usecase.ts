import { INotificationRepository } from './../../../repositories/interfaces/interface-notification-repository';
import { ICancellationMessagesRepository } from '@/repositories/interfaces/interface-cancellation-messages-repository';
import { ICancellationRepository } from "@/repositories/interfaces/interface-cancellations-repository";
import { IUsersRepository } from "@/repositories/interfaces/interface-users-repository";
import { AppError } from "@/usecases/errors/app-error";
import { IDateProvider } from '@/providers/DateProvider/interface-date-provider';
import { EtherealProvider } from '@/providers/MailProvider/implementations/provider-ethereal';
import { IMailProvider } from '@/providers/MailProvider/interface-mail-provider';
import { env } from '@/env';
import { Item } from '@prisma/client';

interface IRequestSendMessageCancellation{
    cancellationId: string
    userId: string
    message: string
    imageUrl?: string | null
}

export class SendMessageCancellationsUseCase {
    constructor(
        private cancellationsMessageRepository: ICancellationMessagesRepository,
        private cancellationRepository: ICancellationRepository,
        private notificationsRepository: INotificationRepository,
        private dateProvider: IDateProvider,
        private etherealProvider: EtherealProvider,
        private mailProvider: IMailProvider,
        private userRepository: IUsersRepository
    ) {}

    async execute({
        cancellationId, 
        message,
        userId,
        imageUrl
    }:IRequestSendMessageCancellation): Promise<void>{
        // buscar cancelamento pelo id
        const findCancellationExist = await this.cancellationRepository.findById(cancellationId)
        
        // validar se existe cancelamento com o mesmo id
        if(!findCancellationExist){
            throw new AppError('Cancelamento não encontrado', 404)
        }
        
        // buscar usuario pelo id
        const findUserExist = await this.userRepository.findById(userId)

        // validar se o usuario existe
        if(!findUserExist){
            throw new AppError('Usuario não encontrado', 404)
        }

        const dateNow = this.dateProvider.addDays(0)

        // criar menssagem de cancelamento
        await this.cancellationsMessageRepository.create({
            cancellationId,
            message,
            imageUrl,
            userId,
            createdAt: dateNow
        })

        const createdAtFormatLocale = findCancellationExist.order.createdAt.toLocaleString().split('T')[0]

        const createdAtFormat = createdAtFormatLocale.split(',')[0]

        const image = imageUrl && imageUrl.length > 0 ? imageUrl : ''

        const total = Number(findCancellationExist.order.total)

        // atualizar a notifcação do cancelamento isReady=true
        await this.notificationsRepository.toggleIsRead(findCancellationExist.id, true)

        // pegar template de verificaçao de email
        let pathTemplate = env.NODE_ENV === "development" ? 
        './views/emails/cancellation-message.hbs':
        './build/views/emails/cancellation-message.hbs' 

        // enviar mensagem para o usario com a mensagem de cancelamento
        await this.mailProvider.sendEmail(
            findUserExist.email,
            findUserExist.name,
            'Nova Mensagem de Cancelamento do Pedido',
            image,
            pathTemplate,
            {
                order: {
                    ...findCancellationExist.order,
                    total: total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) as unknown as number,
                    createdAt: createdAtFormat,
                    items: findCancellationExist.order.items.map(item => {
                        const price = Number(item.price)
                        return {
                            ...item,
                            price: price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                        } as unknown as Item 
                    }), 
                },
                text: 'Gostaríamos de informar que há uma nova mensagem relacionada ao cancelamento do seu pedido ',
                message,
            }

        )


        // this.etherealProvider.sendEmail(
        //     findUserExist.email,
        //     findUserExist.name,
        //     'Nova Mensagem de Cancelamento do Pedido',
        //     image,
        //     pathTemplate,
        //     {
        //         order: {
        //             ...findCancellationExist.order,
        //             total: total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}),
        //             createdAt: createdAtFormat,
        //             items: findCancellationExist.order.items.map(item => {
        //                 const price = Number(item.price)
        //                 return {
        //                     ...item,
        //                     price: price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        //                 } as unknown as Item 
        //             }), 
        //         },
        //         text: 'Gostaríamos de informar que há uma nova mensagem relacionada ao cancelamento do seu pedido ',
        //         message,
        //     }

        // )
    }
}