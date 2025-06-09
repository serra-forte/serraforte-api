import { IOrderRelationsDTO } from '@/dtos/order-relations.dto';
import { IOrderRepository } from '../../../../../repositories/interfaces/interface-order-repository';
import { IPaymentsRepository } from '@/repositories/interfaces/interface-payments-repository';
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
    const foundPaymentExist = await this.paymentsRepository.findByAsaasPaymentId(
      paymenAsaas.id,
    )

      if (!foundPaymentExist) {
        throw new AppError('Pagamento não encontrado', 404)
      }


      if (foundPaymentExist.paymentStatus === Status.APPROVED) {
        throw new AppError('Pagamento já foi feito', 400)
      }

      const findOrderExist = await this.orderRepository.findById(foundPaymentExist.orderId)
      
      if (!findOrderExist) {
        throw new AppError('Pedido não encontrado', 404)
      }

	  if (event === 'PAYMENT_REPROVED_BY_RISK_ANALYSIS') { 
		this.evetBus.updateOrderReprovedEvent(findOrderExist)

		this.evetBus.sendOrderReprovedEmailEvent(findOrderExist)
        
        return
      }else if (
        (event === 'PAYMENT_RECEIVED' && paymenAsaas.billingType === 'PIX') || 
        (event === 'PAYMENT_RECEIVED' && paymenAsaas.billingType === 'BOLETO') ||
        (event === 'PAYMENT_CONFIRMED' && paymenAsaas.billingType === 'CREDIT_CARD'))
		{ 
			this.evetBus.updateOrderConfirmedEvent(findOrderExist)

			this.evetBus.sendOrderApprovedEmailEvent(findOrderExist)
			
			const hasErp = await this.remoteConfig.getTemplate('hasErp')

			if (hasErp.isValid) {
				try {
					await this.kafkaProducer.execute('CREATE_ORDER_BIER_HELD', findOrderExist);
				} catch (error) {
					console.error('Erro ao enviar para o ERP:', error);
				}
			}

			if (findOrderExist.withdrawStore === false) {
				try {
					await this.kafkaProducer.execute('SEPARATE_PACKAGE', findOrderExist);
				} catch (error) {
					console.error('Erro ao enviar para Melhor Envio:', error);
				}
			}
		}      
    }
}
