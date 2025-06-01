import { IOrderRelationsDTO } from '@/dtos/order-relations.dto';
import { IOrderRepository } from './../../../../../repositories/interfaces/interface-order-repository';
import { IDateProvider } from '@/providers/DateProvider/interface-date-provider';
import { IMailProvider } from '@/providers/MailProvider/interface-mail-provider';
import { IPaymentsRepository } from '@/repositories/interfaces/interface-payments-repository';
import { IUsersRepository } from '@/repositories/interfaces/interface-users-repository';
import { AppError } from '@/usecases/errors/app-error';
import { Status } from '@prisma/client';
import 'dotenv/config';
import { IProductsRepository } from '@/repositories/interfaces/interface-products-repository';
import { KafkaProducer } from '@/providers/QueueProvider/kafka/kafka-producer';
import { IRemoteConfigProvider } from '@/providers/RemoteConfigProvider/interface-remote-config-provider';

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
    private mailProvider: IMailProvider,
    private userRepository: IUsersRepository,
    private dayjsProvider: IDateProvider,
    private productRepository: IProductsRepository,
    private kafkaProducer: KafkaProducer,
    private remoteConfig: IRemoteConfigProvider
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
      // [x] buscar todos os usuarios administradores
      const listUsersAdmin = await this.userRepository.listAdmins()

       const orders = await this.orderRepository.listByAsaasPaymentId(paymenAsaasId)

       const endOrder: IOrderRelationsDTO = {
        id: findOrderExist.id,
        user: findOrderExist.user,
        erpClientId: findOrderExist.user.erpClientId,
        delivery: {
            id: findOrderExist.delivery.id,
            address: findOrderExist.delivery.address ? findOrderExist.delivery.address : undefined,
            freights: findOrderExist.delivery.freights,
            shippingDate: findOrderExist.delivery.shippingDate,
            serviceDelivery: findOrderExist.delivery.serviceDelivery
        },
        withdrawStore: findOrderExist.withdrawStore,
        boxes: findOrderExist.boxes,
        payment: orders[0].payment,
        total: 0,
        items: []
      } as unknown as IOrderRelationsDTO;

      let listShopkeeper = []

      
      for (let order of orders) {
          let total = Number(order.total);  // Certifica que 'total' é um número
          endOrder.total += total;         // Acumula o total
          endOrder.items.push(...order.items); // spreed no array de items para acumular os items anteriores e os novos

          // pegar shopkeepers pelo item do pedido
          const findShopkeeper = await this.userRepository.findById(order.items[0].userId as string)

          // validar se o shopkeeper existe
          if(findShopkeeper){
            listShopkeeper.push(findShopkeeper)
          }
      }
      // [x] criar variavel com caminho do templeate de email de pagamento reprovado
      const templatePathUserReproved =
      './views/emails/admin-payment-reproved.hbs'

      if (event === 'PAYMENT_REPROVED_BY_RISK_ANALYSIS') { 
        // [x] atualizar payment no banco de dados com os dados recebidos e status REPROVED
         await this.paymentsRepository.updateById(
          payment.id,
          Status.REPROVED,
          new Date(this.dayjsProvider.addDays(0)),
        )

          // [x] disparar envio de email de pagamento recebido do usuário com nota fiscal(invoice)
          await this.mailProvider.sendEmail(
            findOrderExist.user.email,
            findOrderExist.user.name,
            'Pagamento Reprovado',
            payment.invoiceUrl,
            templatePathUserReproved,
            {
              order: endOrder,
            },
          )
          // [x] criar variavel com caminho do templeate de email de pagamento reprovado
          const templatePathAdminPaymentReproved =
          './views/emails/admin-payment-reproved.hbs'

          // [x] atualizar o pedido com status CANCELED
          await this.orderRepository.updateStatus(
            findOrderExist.id,
            Status.CANCELED
          )
          
          // [x] adicioanr descrição no pedido para informar que o pagamento foi reprovado
          await this.orderRepository.addDescription(findOrderExist.id, 'Reprovado pela análise de risco do cartão de crédito') 

          // ENVIAR EMAIL PARA ADMIN DO SISTEMA AVISANDO QUE O PAGAMENTO FOI REPROVADO
          // [x] for para buscar users administradores e enviar email de pagamento reprovado
          for (const admin of listUsersAdmin) {
            await this.mailProvider.sendEmail(
              admin.email,
              admin.name,
              `Pagamento Reprovado`,
              payment.invoiceUrl,
              templatePathAdminPaymentReproved,
              {
                order: endOrder,
              },
            )
          }
          // [x] for para buscar users Lojistas e enviar email de pagamento aprovado
          for (const shopkeeper of listShopkeeper) {
            await this.mailProvider.sendEmail(
              shopkeeper.email,
              shopkeeper.name,
              `Pagamento Reprovado`,
              payment.invoiceUrl,
              templatePathAdminPaymentReproved,
              {
                order: endOrder,
              },
            )
          }

          return
      }else if (
        (event === 'PAYMENT_RECEIVED' && paymenAsaas.billingType === 'PIX') || 
        (event === 'PAYMENT_RECEIVED' && paymenAsaas.billingType === 'BOLETO') ||
        (event === 'PAYMENT_CONFIRMED' && paymenAsaas.billingType === 'CREDIT_CARD'))
		{ 

        // [x] atualizar status de pagamento para "APPROVED" no banco de dados
        await this.paymentsRepository.updateById(
          payment.id,
          Status.APPROVED,
          new Date(this.dayjsProvider.addDays(0)),
        )

        // [x] atualizar status de pedido para "AWAITING_LABEL" no banco de dados
        await this.orderRepository.updateStatus(
          findOrderExist.id,
          Status.AWAITING_LABEL
        )

        // atualizar mais vendidos do produto com a quantidade de vendas no pedido
        for(let product of findOrderExist.items) {
          const quantity = Number(product.quantity)
          await this.productRepository.updateSales(product.productId, quantity)
        }

        // [x] adicionar descrição que o pagamento foi aprovado
        await this.orderRepository.addDescription(findOrderExist.id, 'Pagamento aprovado')

        // [x] criar variavel com caminho do template de email
        const templatePathApproved = './views/emails/payment-approved.hbs'
        
        // [x] disparar envio de email de pagamento recebido do usuário com nota fiscal(invoice)
        await this.mailProvider.sendEmail(
          findOrderExist.user.email,
          findOrderExist.user.name,
          'Pagamento Aprovado',
          payment.invoiceUrl,
          templatePathApproved,
          {
            order: endOrder,
          },
        )
        
        // [x] disparar envio de email de pagamento recebido para o admin com comprovante(payment - banco de dados API)
        const templatePathAdmin = './views/emails/admin-payment-approved.hbs'

        // [x] for para buscar users administradores e enviar email de pagamento aprovado
        for (const admin of listUsersAdmin) {
          await this.mailProvider.sendEmail(
            admin.email,
            admin.name,
            `Pagamento Aprovado`,
            payment.invoiceUrl,
            templatePathAdmin,
            {
              order: endOrder,
            },
          )
        }

        // [x] for para buscar users Lojistas e enviar email de pagamento aprovado
        for (const shopkeeper of listShopkeeper) {
          await this.mailProvider.sendEmail(
            shopkeeper.email,
            shopkeeper.name,
            `Pagamento Aprovado`,
            payment.invoiceUrl,
            templatePathAdmin,
            {
              order: endOrder,
            },
          )
        }
       
        const hasErp = await this.remoteConfig.getTemplate('hasErp')

        if(hasErp){
          // chamar producer para enviar pedido para o ERP(bier-held)
          await this.kafkaProducer.execute('CREATE_ORDER_BIER_HELD', endOrder)
        }

        // chamar producer para enviar endOrder para o consumer enviar um frete para o carrinho da melhor envio
        await this.kafkaProducer.execute('SEPARATE_PACKAGE', endOrder)
      }      
    }
  }
}
