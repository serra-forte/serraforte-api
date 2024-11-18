import { AppError } from '@/usecases/errors/app-error';
import { IDateProvider } from '@/providers/DateProvider/interface-date-provider';
import { IOrderRelationsDTO } from '@/dtos/order-relations.dto';
import { IOrderRepository } from '@/repositories/interfaces/interface-order-repository';
import { IDeliveryRepository } from '@/repositories/interfaces/interface-deliveries-repository';
interface IRequestConfirmShipment {
    orderId: string
}

export class ConfirmShipmentOrderUseCase {
    constructor(
        private orderRepository: IOrderRepository,
        private deliveryRepository: IDeliveryRepository,
        private dateProvider: IDateProvider
    ) {}
    async execute({ orderId }: IRequestConfirmShipment) {
        // verificar se o pedido existe
        const findOrderExist = await this.orderRepository.findById(orderId) as unknown as IOrderRelationsDTO

        // verificar se o pedido existe
        if(!findOrderExist) {
            throw new AppError('Pedido não encontrado', 404);
        }

        // confirmar se o pedido foi pago
        if(findOrderExist.payment.paymentStatus !== 'APPROVED') {
            throw new AppError('O pagamento do pedido não foi realizado para confirmar o envio', 400);
        }

        // gerar data de envio
        const date = this.dateProvider.addDays(0);

        // atualizar o status do pedido
        await this.orderRepository.updateStatus(findOrderExist.id, 'SENT')

        // atualizar o delivery do pedido com a data de envio
        await this.deliveryRepository.confirmShipment({
            id: findOrderExist.delivery.id,
            shipmentDate: date
        })
    }
}