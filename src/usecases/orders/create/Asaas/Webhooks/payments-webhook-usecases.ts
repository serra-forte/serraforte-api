import { IOrderRelationsDTO } from '@/dtos/order-relations.dto';
import { IOrderRepository } from '../../../../../repositories/interfaces/interface-order-repository';
import { IDateProvider } from '@/providers/DateProvider/interface-date-provider';
import { IMailProvider } from '@/providers/MailProvider/interface-mail-provider';
import { IPaymentsRepository } from '@/repositories/interfaces/interface-payments-repository';
import { IUsersRepository } from '@/repositories/interfaces/interface-users-repository';
import { AppError } from '@/usecases/errors/app-error';
import { Status } from '@prisma/client';
import 'dotenv/config';
import { KafkaProducer } from '@/providers/QueueProvider/kafka/kafka-producer';
import { IRemoteConfigProvider } from '@/providers/RemoteConfigProvider/interface-remote-config-provider';
import { EventBusBase } from '@/events/event-bus.base';

export interface IRequestReceiveEvent {
  event: string
  payment: {
    id: string
    customer: string
    invoiceUrl: string | null
    description: string | null
    billingType: string
    paymentDate: string | null
    installment: string | null
    value: number
    netValue: number
    originalValue: number | null
    creditCard: {
      creditCardToken: string
    } | null
  }
}

export class PaymentWebHookUseCases {
  constructor(
    private paymentsRepository: IPaymentsRepository,
    private orderRepository: IOrderRepository,
    private kafkaProducer: KafkaProducer,
    private remoteConfig: IRemoteConfigProvider,
    private evetBus: EventBusBase
  ) {}

  async execute({ event, payment:paymenAsaas }: IRequestReceiveEvent): Promise<void> {
    let paymenAsaasId = String(paymenAsaas.id)

    // [x] buscar pagamento pelo id
    const findPaymentsExist = await this.paymentsRepository.listByAsaasPaymentId(
      paymenAsaasId,
    )

    for(let payment of findPaymentsExist) {
      // buscar pelo id
      const findPaymentExist = await this.paymentsRepository.findById(
        String(payment.id),
      )

      // [x] validar se o pagamento existe
      if (!findPaymentExist) {
        throw new AppError('Pagamento não encontrado', 404)
      }
      // [x] validar se o pagamento já foi aprovado
      if (payment.paymentStatus === Status.APPROVED) {
        throw new AppError('Pagamento já foi feito', 400)
      }

      // [x] buscar pedido pelo id
      const findOrderExist = await this.orderRepository.findById(payment.orderId) as unknown as IOrderRelationsDTO

      // [x] validar se o pedido existe
      if (!findOrderExist) {
        throw new AppError('Pedido não encontrado', 404)
      }

       const orders = await this.orderRepository.listByAsaasPaymentId(paymenAsaasId)

       const endOrder: IOrderRelationsDTO = {
        id: findOrderExist.id,
        user: findOrderExist.user,
        erpClientId: findOrderExist.user.erpClientId,
        delivery: findOrderExist.delivery ? {
            id: findOrderExist.delivery.id,
            address: findOrderExist.delivery.address ? findOrderExist.delivery.address : undefined,
            freights: findOrderExist.delivery.freights,
            shippingDate: findOrderExist.delivery.shippingDate,
            serviceDelivery: findOrderExist.delivery.serviceDelivery
        } : undefined,
        withdrawStore: findOrderExist.withdrawStore,
        boxes: findOrderExist.boxes,
        payment: orders[0].payment,
        total: 0,
        items: []
      } as unknown as IOrderRelationsDTO;

      for (let order of orders) {
          let total = Number(order.total);  // Certifica que 'total' é um número
          endOrder.total += total;         // Acumula o total
          endOrder.items.push(...order.items); // spreed no array de items para acumular os items anteriores e os novos
      }

     
      if (event === 'PAYMENT_REPROVED_BY_RISK_ANALYSIS') { 
        this.evetBus.updateOrderReprovedEvent(endOrder)

        this.evetBus.sendOrderReprovedEmailEvent(endOrder)
        
        return
      }else if (
        (event === 'PAYMENT_RECEIVED' && paymenAsaas.billingType === 'PIX') || 
        (event === 'PAYMENT_RECEIVED' && paymenAsaas.billingType === 'BOLETO') ||
        (event === 'PAYMENT_CONFIRMED' && paymenAsaas.billingType === 'CREDIT_CARD'))
		{ 

      this.evetBus.updateOrderConfirmedEvent(endOrder)

      this.evetBus.sendOrderApprovedEmailEvent(endOrder)
       
      const hasErp = await this.remoteConfig.getTemplate('hasErp')
      if (hasErp.isValid) {
        try {
          await this.kafkaProducer.execute('CREATE_ORDER_BIER_HELD', endOrder);
        } catch (error) {
          console.error('Erro ao enviar para o ERP:', error);
        }
      }

      if (findOrderExist.withdrawStore === false) {
        try {
          await this.kafkaProducer.execute('SEPARATE_PACKAGE', endOrder);
        } catch (error) {
          console.error('Erro ao enviar para Melhor Envio:', error);
        }
      }
      }      
    }
  }
}
