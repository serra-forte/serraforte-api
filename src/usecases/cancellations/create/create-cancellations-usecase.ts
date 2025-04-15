import { IDateProvider } from '@/providers/DateProvider/interface-date-provider';
import { ICancellationRelationsDTO } from './../../../dtos/cancellation-relations.dto';
import { IOrderRelationsDTO } from "@/dtos/order-relations.dto";
import { ICancellationRepository } from "@/repositories/interfaces/interface-cancellations-repository";
import { IOrderRepository } from "@/repositories/interfaces/interface-order-repository";
import { IUsersRepository } from "@/repositories/interfaces/interface-users-repository";
import { AppError } from "@/usecases/errors/app-error";
import { EtherealProvider } from '@/providers/MailProvider/implementations/provider-ethereal';
import { IMailProvider } from '@/providers/MailProvider/interface-mail-provider';
import { env } from '@/env';

interface IRequestCreateCancellation{
    orderId: string
    userId: string
    shopkeeperId: string
    message: string
    imageUrl?: string | null
    reason: string
}

export class CancellationUseCase {
    constructor(
        private cancellationsRepository: ICancellationRepository,
        private orderRepository: IOrderRepository,
        private userRepository: IUsersRepository,
        private dayjsProvider: IDateProvider,
        private etherealProvider: EtherealProvider,
        private mailProvider: IMailProvider
    ) {}

    async execute({
        orderId,
        userId,
        shopkeeperId,
        message,
        imageUrl,
        reason
    }:IRequestCreateCancellation): Promise<ICancellationRelationsDTO>{
        let users = [userId, shopkeeperId]
        let shopkeeperName = ''
        let shopkeeperEmail = ''

        for(let i= 0; i < users.length; i++){
            const userExist = await this.userRepository.findById(users[i])
            if(!userExist){
                throw new AppError('Lojista ou Cliente não encontrado', 404)
            }

            if(i === 1){
                shopkeeperName = userExist.name
                shopkeeperEmail = userExist.email
            }
        }

        // buscar pedido pelo id
        const findOrderExist = await this.orderRepository.findById(orderId) as unknown as IOrderRelationsDTO

        // validar se pedido existe
        if(!findOrderExist){
            throw new AppError('Pedido não encontrado', 404)
        }

        // validar quantos dias depois do pagamento do pedido foi feito o cancelamento
        const orderCancelattionDate = new Date(this.dayjsProvider.addDays(0));

        // [x] calcular a diferença de dias entre a data de pagamento e a data de cancelamento
        const amountDaysAfterDatePayment = this.dayjsProvider.compareInDays(findOrderExist.payment.datePayment as Date, orderCancelattionDate)
        
        // [x] verificar se a diferença de dias entre a data de pagamento e a data de cancelamento for maior que 3 dias
        if(amountDaysAfterDatePayment > 10){
            throw new AppError('O cancelamento para esse pedido já expirou', 400)
        }
        
        const newDate = this.dayjsProvider.addDays(0)
        // criar cancelamento
        const cancellation = await this.cancellationsRepository.create({
            orderId,
            userId,
            reason,
            shopkeeperId: shopkeeperId,
            shopkeeperName,
            cancellationMessages:{
                create:{
                    message,
                    imageUrl,
                    userId
                }
            },
            notification:{
                create: {
                    isRead: true
                }
            },
            createdAt: newDate
        })

        // pegar template de verificaçao de email
        let pathTemplate = env.NODE_ENV === "development" ? 
        './views/emails/cancellation-message.hbs':
        './build/views/emails/cancellation-message.hbs' 

        const createdAtFormatLocale = findOrderExist.createdAt.toLocaleString().split('T')[0]

        const createdAtFormat = createdAtFormatLocale.split(',')[0]

        const image = imageUrl && imageUrl.length > 0 ? imageUrl : ''

        // enviar mensagem para o lojista com a mensagem de cancelamento
        await this.mailProvider.sendEmail(
            shopkeeperEmail,
            shopkeeperName,
            'Nova Mensagem de Cancelamento do Pedido',
            image,
            pathTemplate,
            {
                order: {
                    ...findOrderExist,
                    total: findOrderExist.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) as unknown as number,
                    createdAt: createdAtFormat,
                    items: findOrderExist.items.map(item => {
                        const price = Number(item.price)
                        return {
                            ...item,
                            total: price.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}),
                        }
                    }),
                },
                text: 'Informamos que há uma nova mensagem relacionada ao cancelamento do pedido',
                message,
            }

        )

        // enviar mensagem para o lojista com a mensagem de cancelamento
        // this.etherealProvider.sendEmail(
        //     shopkeeperEmail,
        //     shopkeeperName,
        //     'Nova Mensagem de Cancelamento do Pedido',
        //     image,
        //     pathTemplate,
        //     {
        //         order: {
        //             ...findOrderExist,
        //             total: findOrderExist.total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}),
        //             createdAt: createdAtFormat,
        //             items: findOrderExist.items.map(item => {
        //                 const price = Number(item.price)
        //                 return {
        //                     ...item,
        //                     total: price.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}),
        //                 }
        //             }),
        //         },
        //         text: 'Informamos que há uma nova mensagem relacionada ao cancelamento do pedido',
        //         message,
        //     }

        // )

        return cancellation
    }
}