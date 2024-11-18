import { AppError } from '../../errors/app-error';
import { IOrderRelationsDTO } from '../../../dtos/order-relations.dto';
import { IDateProvider } from '../../../providers/DateProvider/interface-date-provider';
import { IOrderRepository } from '../../../repositories/interfaces/interface-order-repository';
interface IRequestConfirmShipment {
    orderId: string
}

export class ConfirmWithdrawedStoreOrderUseCase {
    constructor(
        private orderRepository: IOrderRepository,
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
            throw new AppError('O pagamento não foi realizado para confirmar a retirada do pedido na loja', 400);
        }

        // gerar data de envio
        const date = this.dateProvider.addDays(0);

        // atualizar o status do pedido
        await this.orderRepository.updateStatus(findOrderExist.id, 'DONE')

        // atualizar o delivery do pedido com a data de envio
        await this.orderRepository.confirmWithdrawed(
            findOrderExist.id,
            date
        )
    }
}