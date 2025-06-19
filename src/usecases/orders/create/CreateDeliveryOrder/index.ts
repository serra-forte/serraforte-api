import { EventBusBase } from "@/events/event-bus.base";
import { IDeliveryOrderRequest } from "@/interfaces/request/delivery-order-request.interface";
import { IOrderResponse } from "@/interfaces/response/order-response.interface copy";
import { IAddressesRepository } from "@/repositories/interfaces/interface-addresses-repository";
import { CoupomServiceBase } from "@/services/coupom/coupom.base";
import { OrderServiceBase } from "@/services/order/order.base";
import { PaymentService } from "@/services/payment/payment.service";
import { ShoppingCartServiceBase } from "@/services/shopping-cart/shopping-cart.base";
import { StockServiceBase } from "@/services/stock/stock.base";
import { UserServiceBase } from "@/services/user/user.base";
import { PaymentMethod } from "@prisma/client";

export class CreateDeliveryOrderUseCase {
    private discount = 0

    constructor(
        private userService: UserServiceBase,
        private stockService: StockServiceBase,
        private shoppingCartService: ShoppingCartServiceBase,
        private coupomService: CoupomServiceBase,
        private orderService: OrderServiceBase,
        private paymentService: PaymentService,
        private addressRepository: IAddressesRepository,
        private eventBus: EventBusBase
    ) {}

    async execute({
        userData,
        remoteIp,
        coupom,
        address,
        freight,
        paymentMethod,
        creditCardData
    }:IDeliveryOrderRequest): Promise<IOrderResponse> {
        try{
            // Buscar o usuário valido
            const foundUser = await this.userService.findById(userData)

            // Busca os itens do carrinho
            const getCartItems = await this.shoppingCartService.getItems(foundUser.id)
        
            // Buscar total do carrinho
            const getCartTotal =  await this.shoppingCartService.getTotal(foundUser.id)

            // Decrementa o estoque
            await this.stockService.decrement(getCartItems)

            // Calcula o desconto se existir
            if(coupom && coupom.code){
                this.discount = await this.coupomService.apply(coupom.code, getCartTotal)
            }

            // Calcular o total
            const total = getCartTotal + freight.price - this.discount

            // Criar pedido
            const order = await this.orderService.createDeliveryOrder({
                userId: foundUser.id,
                total,
                address,
                items: getCartItems,
                freight,
                discount: this.discount,
                paymentMethod,
                shoppingCartId: foundUser.shoppingCart.id
            })
       
            // Criar pagamento
            const payment = await this.paymentService.resolvePaymentMethod({
                orderId: order.id,
                user: foundUser,
                billingType: paymentMethod,
                remoteIp,
                description: `Pedido #${order.code} - ${foundUser.name}`,
                value: total,
                dueDate: new Date().toISOString(),
                creditCardData
            })
            
            if(paymentMethod !== PaymentMethod.CREDIT_CARD){
                // enviar mensagem por email no evento
                this.eventBus.sendOrderConfirmationEmailEvent({
                    order,
                    user: foundUser,
                    invoiceUrl: payment.invoiceUrl
                })
            }

            this.eventBus.updateUserAddressErpEvent({
                id: foundUser.id,
                erpId: Number(foundUser.erpUserId as number),
                address,
            })
            
            // retornar url da fatura
            return { invoiceUrl: payment.invoiceUrl }
        } catch (error) {
            throw error
        }
    }
}