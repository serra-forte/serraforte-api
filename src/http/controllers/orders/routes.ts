import { FastifyInstance } from "fastify";
import { ListOrderByUser } from "./list-by-user/list-by-user-order-controller";
import { ListOrder } from "./list/list-order-controller";
import { CreateOrderWithAsaas } from "./create/asaas/create-order-with-asaas-controller";
import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt";
import { FindOrderById } from "./find-by-id/find-by-id-order-controller";
import { PaymentWebHook } from "./webhooks/asaas/events-webhook-payments-controller";
import { verifyAsaasPaymentToken } from "@/http/middlewares/verify-token-payment-asaas";
import { ConfirmShipment } from "./confirm-shipment/confirm-shipment-order-controller";
import { ConfirmDelivery } from "./confirm-delivery/confirm-delivery-order-controller";
import { ChooseDeliveryMan } from "./choose-deliveryman/confirm-deliveryman-order-controller";
import { ListByDeliveryman } from "./list-by-deliveryman/list-by-deliveryman-controller";
import { ListByShoppkeeper } from "./list-by-shoppkeeper/list-by-shoppkeeper-controller";
import { VerItem } from "./ver-item/ver-item-oder-controller";
import { FilterOrder } from "./filter/filter-orders-controller";
import { CountBySent } from "./count-by-sent/count-by-sent-reviews-controller";
import { ConfirmWithdrawedStore } from "./confirm-withadrawed-store/confirm-withdrawed-store-order-controller";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

export async function ordersRoutes(fastifyApp: FastifyInstance) {
    // criar order
    fastifyApp.post('/', {
        onRequest: [verifyTokenJWT],
        config: {
            rateLimit: {
                max: 5,
                timeWindow: '1 minute'
            }
        }
    }, CreateOrderWithAsaas)

    // listar orders pelo user
    fastifyApp.get('/user', {
        onRequest: [verifyTokenJWT]
    }, ListOrderByUser)

    // listar todos os orders
    fastifyApp.get('/', {
        onRequest: [verifyTokenJWT]
    }, ListOrder)

    // econtrar order pelo id
    fastifyApp.get('/:id', {
        onRequest: [verifyTokenJWT]
    }, FindOrderById)

    // confirmar pedido como enviado
    fastifyApp.patch('/confirm-shipment/:id', {
        onRequest: [verifyTokenJWT],
    }, ConfirmShipment)

    // confirmar pedido como entregue
    fastifyApp.put('/confirm-delivery', {
        onRequest: [verifyTokenJWT],
    }, ConfirmDelivery)

    // confirmar pedido como retirado na loja
    fastifyApp.put('/confirm-withdrawed/:id', {
        onRequest: [verifyTokenJWT, verifyUserRole('ADMIN', 'SHOPKEEPER', 'SUPER')],
    }, ConfirmWithdrawedStore)

    // escolher entregador para o pedido
    fastifyApp.put('/choose-deliveryman', {
        onRequest: [verifyTokenJWT],
    }, ChooseDeliveryMan)

    // listar pedidos para o entreregador
    fastifyApp.get('/deliveryman', {
        onRequest: [verifyTokenJWT],
    }, ListByDeliveryman)

    // listar pedidos para o lojista
    fastifyApp.get('/shoppkeeper', {
        onRequest: [verifyTokenJWT],
    }, ListByShoppkeeper)

    // listar pedidos através de um filtro
    fastifyApp.get('/filter', {
        onRequest: [verifyTokenJWT],
    }, FilterOrder)

    // contar pelos cancelamentos enviados
    fastifyApp.get('/count-sent', {
        onRequest: [verifyTokenJWT],
    }, CountBySent)

    // ===== Ver Item =====
    fastifyApp.get('/item/:id', {
        onRequest: [verifyTokenJWT],
    }, VerItem)

    // ===== WebHooks =====
    // payment webhook
    fastifyApp.post('/webhook-payment', {
        onRequest: [verifyAsaasPaymentToken]
    }, PaymentWebHook)
}