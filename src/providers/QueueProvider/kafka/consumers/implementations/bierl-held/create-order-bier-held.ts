import { IOrderRepository } from "@/repositories/interfaces/interface-order-repository";
import { PrismaOrderRepository } from "@/repositories/prisma/prisma-orders-repository";
import { IBierHeldProvider } from "@/providers/BierHeldProvider/bier-held-interface";
import { BierHeldProvider } from "@/providers/BierHeldProvider/implementations/bier-held-provider";
import { IOrderRelationsDTO } from "@/dtos/order-relations.dto";
import { KafkaConsumerCreateOrder } from "../../interface/bier-held/kafka-consumer-create-order";

export class CreateOrderBierHeld {
    private kafkaConsumer: KafkaConsumerCreateOrder;
    private orderRepository: IOrderRepository;
    private bierHeldProvider: IBierHeldProvider

    constructor() {
        this.kafkaConsumer = new KafkaConsumerCreateOrder();
        this.orderRepository = new PrismaOrderRepository();
        this.bierHeldProvider = new BierHeldProvider()
    }

    async execute() {
        const createdConsumer = await this.kafkaConsumer.execute('CREATE_ORDER_BIER_HELD');

        createdConsumer.run({
            eachMessage: async ({ message }) => {
                if (!message || !message.value) {
                    console.warn('[Consumer - Create order] Mensagem vazia ou inválida:', message);
                    return;
                }

                try {
                    const parsedMessage = JSON.parse(message.value.toString());
                    console.log('[Consumer - Create order] Mensagem recebida:');

                    if (!parsedMessage.items || !Array.isArray(parsedMessage.items) || parsedMessage.items.length === 0) {
                        // console.warn('[Consumer - Freight] Itens do pedido estão ausentes ou inválidos.');
                        return;
                    }


                    const order = parsedMessage as IOrderRelationsDTO;

                    // console.log(order.delivery)

                    let payTypeId = 39

                   if(order.payment.paymentMethod === 'BOLETO'){
                        payTypeId = 345
                   }else if(order.payment.paymentMethod === 'CREDIT_CARD'){
                        payTypeId = 37 
                   } 
                    const createdOrderBierHeld = await this.bierHeldProvider.createOrder({
                        send_order_mail: true,
                        client_mail: order.user.email,
                        order:{
                            client_id: order.user.bierHeldClientId as number,
                            order_value: order.total,
                            delivery_value: Number(order.delivery.serviceDelivery.price),
                            return_value: 100,
                            total_value: order.total,
                            delivery_date_time: String(order.delivery.shippingDate),
                            address_attributes: {
                                street: order.delivery.address.street as string,
                                number: String(order.delivery.address.num as number),
                                complement: order.delivery.address.complement as string,
                                district: order.delivery.address.neighborhood as string,
                            },
                            // order_items_attributes: order.items.map(item => ({
                            //     reference_item_id: 'verificar como fazer isso.',
                            //     quantity: item.quantity,
                            //     name: item.name,
                            //     price: item.price,
                            // })),
                            payments_attributes: [
                                {
                                   pay_type_id: payTypeId,
                                   value: order.total
                                }
                            ]
                        }
                    });

                    console.log(createdOrderBierHeld);

                } catch (error) {
                    console.error('[Consumer - Create order] Erro ao processar mensagem:', error);
                }
            },
        });
    }
}

const createOrderBierHeld = new CreateOrderBierHeld();
createOrderBierHeld.execute();

