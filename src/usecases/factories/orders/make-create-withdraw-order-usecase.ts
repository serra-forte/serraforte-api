import { EventBus } from "@/events/event-bus.provider"
import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs"
import { AsaasProvider } from "@/providers/PaymentProvider/implementations/provider-asaas-payment"
import { PrismaCartItemRepository } from "@/repositories/prisma/prisma-cart-item-repository"
import { PrismaDiscountCounpons } from "@/repositories/prisma/prisma-discount-counpons-repository"
import { PrismaOrderRepository } from "@/repositories/prisma/prisma-orders-repository"
import { PrismaPaymentRepository } from "@/repositories/prisma/prisma-payments-repository"
import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository"
import { PrismaShoppingCartRepository } from "@/repositories/prisma/prisma-shopping-cart-repository"
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { CoupomService } from "@/services/coupom/coupom.service"
import { OrderService } from "@/services/order/order.service"
import { PaymentService } from "@/services/payment/payment.service"
import { ShoppingCartService } from "@/services/shopping-cart/shopping-car.service"
import { StockService } from "@/services/stock/stock.service"
import { UserService } from "@/services/user/user.service"
import { CreateWithdrawOrderUseCase } from "@/usecases/orders/create/CreateWithdrawOrder"

export async function makeCreateWithdrawOrderUseCase(): Promise<CreateWithdrawOrderUseCase> {
    const orderRepository = new PrismaOrderRepository()
    const productRepository = new PrismaProductsRepository()
    const cartItemRepository = new PrismaCartItemRepository()
    const shoppingCartRepository = new PrismaShoppingCartRepository()
    const discountCouponRepository = new PrismaDiscountCounpons()
    const userRepository = new PrismaUsersRepository()
    const asaasProvider = new AsaasProvider()
    const dayjsDateProvider = new DayjsDateProvider()
    const paymentRepository = new PrismaPaymentRepository()

    const orderService = new OrderService(orderRepository, dayjsDateProvider)
    const stockService = new StockService(productRepository)
    const shoppingCartService = new ShoppingCartService(shoppingCartRepository, cartItemRepository)
    const discountService = new CoupomService(discountCouponRepository)
    const userService = new UserService(userRepository)
    const paymentService = new PaymentService(asaasProvider, userService, paymentRepository)

    const eventBus = new EventBus()

    const createWithdrawOrderUseCase = new CreateWithdrawOrderUseCase(
        userService,
        stockService,
        shoppingCartService,
        discountService,
        orderService,
        paymentService,
        eventBus
    )

    return createWithdrawOrderUseCase
}