import { AppError } from '@/usecases/errors/app-error';
import { IOrderRelationsDTO } from '@/dtos/order-relations.dto';
import { IUsersRepository } from '@/repositories/interfaces/interface-users-repository';
import { IOrderRepository } from '@/repositories/interfaces/interface-order-repository';
import { IDeliveryRepository } from '@/repositories/interfaces/interface-deliveries-repository';
interface IRequestChooseDeliveryMan {
    deliveryManId: string
    orderId: string
}

export class ChooseDeliveryManOrderUseCase {
    constructor(
        private orderRepository: IOrderRepository,
        private deliveryRepository: IDeliveryRepository,
        private userRepository: IUsersRepository
    ) {}
    async execute({ 
        deliveryManId,
        orderId
    }: IRequestChooseDeliveryMan) {
        // buscar usuario pelo deliveryManId
        const findDeliveryManExist = await this.userRepository.findById(deliveryManId)

        // verificar se o deliveryMan existe
        if(!findDeliveryManExist) {
            throw new AppError('Entregador não encontrado', 404);
        }

        // verificar se o deliveryMan é um entregador
        if(findDeliveryManExist.role !== 'DELIVERYMAN') {
            throw new AppError('Usuário não é um entregador', 404);
        }

        // buscar pedido pelo id
        const findOrderExist = await this.orderRepository.findById(orderId) as unknown as IOrderRelationsDTO

        // verificar se o pedido existe
        if(!findOrderExist) {
            throw new AppError('Pedido não encontrado', 404);
        }

        // verificar se o pedido ja foi pago
        if(findOrderExist.payment.paymentStatus !== 'APPROVED') {
            throw new AppError('O pagamento do pedido não foi realizado para escolher o entregador', 400);
        }

        // atualizar o pedido com o id do deliveryMan em delivery
        await this.deliveryRepository.chooseDeliveryMan({
            deliveryId: findOrderExist.delivery.id,
            deliveryManId
        })

        // enviar notificação para o deliveryMan
    }
}