import { IMailProvider } from "@/providers/MailProvider/interface-mail-provider";
import { eventBus } from "../event-bus";
import { ISendOrderConfirmationEmail } from "../interfaces/send-order-confirmation.interface";
import { MailProvider } from "@/providers/MailProvider/implementations/provider-sendgrid";
import { IOrderRepository } from "@/repositories/interfaces/interface-order-repository";
import { PrismaOrderRepository } from "@/repositories/prisma/prisma-orders-repository";
import { PrismaPaymentRepository } from "@/repositories/prisma/prisma-payments-repository";
import { IOrderRelationsDTO } from "@/dtos/order-relations.dto";
import { Status } from "@prisma/client";

export class UpdateOrderReprovedListener {
    private orderRepository: IOrderRepository
    private paymentsRepository = new PrismaPaymentRepository()
    constructor() {
        this.orderRepository = new PrismaOrderRepository();
        this.paymentsRepository = new PrismaPaymentRepository()

        eventBus.on('update.order.reproved', this.execute.bind(this));
    }
    private async execute(order: IOrderRelationsDTO) {
        try{
          await this.orderRepository.updateStatus(
            order.id,
            Status.CANCELED
          )
          
          await this.orderRepository.addDescription(order.id, 'Reprovado pela análise de risco do cartão de crédito') 

          await this.paymentsRepository.updateById(
            order.payment.id,
            Status.REPROVED,
            new Date(),
          )

          console.log('[UpdateOrderReproved - API] Pedido atualizado com sucesso')
        }catch(error){
            throw error
        }
    }
}
