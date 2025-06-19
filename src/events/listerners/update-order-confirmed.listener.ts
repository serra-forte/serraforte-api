import { eventBus } from "../event-bus";
import { IOrderRepository } from "@/repositories/interfaces/interface-order-repository";
import { PrismaOrderRepository } from "@/repositories/prisma/prisma-orders-repository";
import { PrismaPaymentRepository } from "@/repositories/prisma/prisma-payments-repository";
import { IOrderRelationsDTO } from "@/dtos/order-relations.dto";
import { Status } from "@prisma/client";
import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";

export class UpdateOrderConfirmedListener {
    private orderRepository: IOrderRepository
    private paymentsRepository = new PrismaPaymentRepository()
    private productRepository = new PrismaProductsRepository()
    constructor() {
        this.orderRepository = new PrismaOrderRepository();
        this.paymentsRepository = new PrismaPaymentRepository()
        this.productRepository = new PrismaProductsRepository()

        eventBus.on('update.order.confirmed', this.execute.bind(this));
    }
    private async execute(order: IOrderRelationsDTO) {
        try{
        await this.paymentsRepository.updateById(
          order.payment.id,
          Status.APPROVED,
          new Date(),
        )

        if(order.withdrawStore === true){
          await this.orderRepository.updateStatus(
            order.id,
            Status.DONE
          )
        }else{
          await this.orderRepository.updateStatus(
            order.id,
            Status.AWAITING_LABEL
          )
        }
         
        for(let product of order.items) {
          const quantity = Number(product.quantity)
          await this.productRepository.updateSales(product.productId, quantity)
        }

        console.log('[UpdateOrderConfirmed - API] Pedido atualizado com sucesso')
        }catch(error){
            throw error
        }
    }
}
