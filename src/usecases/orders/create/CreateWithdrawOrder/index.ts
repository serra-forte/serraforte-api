import { EventBusBase } from "@/events/event-bus.base";
import { IWithdrawOrderRequest } from "@/interfaces/request/withdraw-order-request.interface";
import { IOrderResponse } from "@/interfaces/response/order-response.interface copy";
import { CoupomServiceBase } from "@/services/coupom/coupom.base";
import { OrderServiceBase } from "@/services/order/order.base";
import { PaymentService } from "@/services/payment/payment.service";
import { ShoppingCartServiceBase } from "@/services/shopping-cart/shopping-cart.base";
import { StockServiceBase } from "@/services/stock/stock.base";
import { UserServiceBase } from "@/services/user/user.base";

export class CreateWithdrawOrderUseCase {
    private discount = 0

    constructor(
        private userService: UserServiceBase,
        private stockService: StockServiceBase,
        private shoppingCartService: ShoppingCartServiceBase,
        private coupomService: CoupomServiceBase,
        private orderService: OrderServiceBase,
        private paymentService: PaymentService,
        private eventBus: EventBusBase
    ) {}


    async execute({
        userId,
        remoteIp,
        coupom,
        paymentMethod,
        creditCardData
    }:IWithdrawOrderRequest): Promise<IOrderResponse> {
        try{
            // Buscar o usuário valido
            const user = await this.userService.findById(userId)

            // Busca os itens do carrinho
            const getCartItems = await this.shoppingCartService.getItems(user.id)
        
            // Buscar total do carrinho
            const getCartTotal =  await this.shoppingCartService.getTotal(user.id)

            // Decrementa o estoque
            await this.stockService.decrement(getCartItems)

            // Calcula o desconto se existir
            if(coupom && coupom.code){
                this.discount = await this.coupomService.apply(coupom.code, getCartTotal)
            }

            // Calcular o total
            const total = getCartTotal - this.discount

            // Criar pedido
            const order = await this.orderService.createWithdrawOrder({
                userId: user.id,
                total,
                items: getCartItems,
                discount: this.discount,
                paymentMethod,
                shoppingCartId: user.shoppingCart.id
            })

            // Criar pagamento
            const payment = await this.paymentService.resolvePaymentMethod({
                orderId: order.id,
                user,
                billingType: paymentMethod,
                remoteIp,
                description: `Pedido #${order.code} - ${user.name}`,
                value: total,
                dueDate: new Date().toISOString(),
                creditCardData
            })
            
            // enviar mensagem por email no evento
            this.eventBus.sendOrderConfirmationEmailEvent({
                order,
                user,
                invoiceUrl: payment.invoiceUrl
            })
            
            // retornar url da fatura
            return { invoiceUrl: payment.invoiceUrl }
        } catch (error) {
            throw error
        }
    }
}