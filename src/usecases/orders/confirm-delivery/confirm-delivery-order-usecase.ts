import { AppError } from '@/usecases/errors/app-error';
import { IDateProvider } from '@/providers/DateProvider/interface-date-provider';
import { IOrderRelationsDTO } from '@/dtos/order-relations.dto';
import { IOrderRepository } from '@/repositories/interfaces/interface-order-repository';
import { IDeliveryRepository } from '@/repositories/interfaces/interface-deliveries-repository';
interface IRequestConfirmDelivery {
    orderId: string
    receiverName?: string | null
    receiverDocument?: string | null
    longitude?: number | null
    latitude?: number | null
}

export class ConfirmDeliveryOrderUseCase {
    constructor(
        private orderRepository: IOrderRepository,
        private deliveryRepository: IDeliveryRepository,
        private dateProvider: IDateProvider
    ) {}
    async execute({ 
        orderId,
        receiverName,
        receiverDocument,
        longitude,
        latitude 
    }: IRequestConfirmDelivery) {
        // verificar se o pedido existe
        const findOrderExist = await this.orderRepository.findById(orderId) as unknown as IOrderRelationsDTO

        // verificar se o pedido existe
        if(!findOrderExist) {
            throw new AppError('Pedido não encontrado', 404);
        }

        // verificar se o pedido foi pago
        if(findOrderExist.payment.paymentStatus !== 'APPROVED') {
            throw new AppError('O pagamento do pedido não foi realizado para confirmar a entrega', 400);
        }

        // verificar se o pedido foi enviado
        if(findOrderExist.status !== 'SENT') {
            throw new AppError('O pedido não foi enviado para confirmar a entrega', 400)
        }

        // gerar data de envio
        const date = this.dateProvider.addDays(0);

        // atualizar o status do pedido
        await this.orderRepository.updateStatus(findOrderExist.id, 'DONE')

        // atualizar o delivery do pedido com a data de envio
        await this.deliveryRepository.confirmDelivery({
            id: findOrderExist.delivery.id,
            deliveryDate: date,
            receiverDocument: receiverDocument as string ?? null,
            receiverName: receiverName as string ?? null,
            longitude: longitude as number ?? null,
            latitude: latitude as number ?? null
        })
    }
}