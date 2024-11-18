import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs";
import { MelhorEnvioProvider } from "@/providers/DeliveryProvider/implementations/provider-melhor-envio";
import { MailProvider } from "@/providers/MailProvider/implementations/provider-sendgrid";
import { AsaasProvider } from "@/providers/PaymentProvider/implementations/provider-asaas-payment";
import { RailwayProvider } from "@/providers/RailwayProvider/implementations/provider-railway";
import { PrismaCartItemRepository } from "@/repositories/prisma/prisma-cart-item-repository";
import { PrismaDiscountCounpons } from "@/repositories/prisma/prisma-discount-counpons-repository";
import { PrismaOrderRepository } from "@/repositories/prisma/prisma-orders-repository";
import { PrismaPaymentRepository } from "@/repositories/prisma/prisma-payments-repository";
import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";
import { PrismaShoppingCartRepository } from "@/repositories/prisma/prisma-shopping-cart-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { CreateOrderWithCreditCardUsecase } from "@/usecases/orders/create/asaas/credit-card/create-order-with-credit-card-usecase";

export async function makeCreateOrderWithCreditCardUsecase(): Promise<CreateOrderWithCreditCardUsecase>{
        const orderRepository = new PrismaOrderRepository()
        const userRepository = new PrismaUsersRepository()
        const shoppingCartRepository = new PrismaShoppingCartRepository()
        const cartItemRepository = new PrismaCartItemRepository()
        const productRepository = new PrismaProductsRepository()
        const dayjsProvider = new DayjsDateProvider()
        const asaasProvider = new AsaasProvider()
        const sendGridProvider = new MailProvider()
        const discountCouponRepository = new PrismaDiscountCounpons()
        const railwayProvider = new RailwayProvider()
        const melhorEnvioProvider = new MelhorEnvioProvider(railwayProvider)

        const createOrderWithCreditCardUsecase = new CreateOrderWithCreditCardUsecase(
            orderRepository,
            userRepository,
            shoppingCartRepository,
            cartItemRepository,
            productRepository,
            dayjsProvider,
            asaasProvider,
            sendGridProvider,
            discountCouponRepository,
            melhorEnvioProvider
        )
        return createOrderWithCreditCardUsecase
}