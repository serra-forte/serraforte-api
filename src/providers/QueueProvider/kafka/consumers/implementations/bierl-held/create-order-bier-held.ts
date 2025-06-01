import { IOrderRepository } from "@/repositories/interfaces/interface-order-repository";
import { PrismaOrderRepository } from "@/repositories/prisma/prisma-orders-repository";
import { IBierHeldProvider } from "@/providers/BierHeldProvider/bier-held-interface";
import { BierHeldProvider } from "@/providers/BierHeldProvider/implementations/bier-held-provider";
import { IOrderRelationsDTO } from "@/dtos/order-relations.dto";
import { KafkaConsumerCreateOrder } from "../../interface/bier-held/kafka-consumer-create-order";
import { IProductsRepository } from "@/repositories/interfaces/interface-products-repository";
import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";

export class CreateOrderBierHeld {
    private kafkaConsumer: KafkaConsumerCreateOrder;
    private orderRepository: IOrderRepository;
    private bierHeldProvider: IBierHeldProvider;
    private productRepository: IProductsRepository;

    constructor() {
        this.kafkaConsumer = new KafkaConsumerCreateOrder();
        this.orderRepository = new PrismaOrderRepository();
        this.bierHeldProvider = new BierHeldProvider();
        this.productRepository = new PrismaProductsRepository();
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

                    let bierHeldItems:{reference_item_id:number, name:string, quantity:number, price:number}[] = []

                    for(const item of order.items){
                        const findProduct = await this.productRepository.findById(item.productId)

                        if(!findProduct){
                            throw new Error('Produto nao encontrado')
                        }

                        const getItemBierHeld = await this.bierHeldProvider.getItem(findProduct.product.erpProductId)

                        if(!getItemBierHeld){
                            throw new Error('Item nao encontrado')
                        }
                        
                        bierHeldItems.push({
                            reference_item_id: getItemBierHeld.id,
                            name: getItemBierHeld.name,
                            quantity: Number(item.quantity),
                            price: Number(item.price)
                        })
                    }

                    let delivery_method: 'delivery_by_shipper' | 'withdrawal_at_company' = 'delivery_by_shipper'

                    if(order.withdrawStore === true){
                        delivery_method = 'withdrawal_at_company'
                    }

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
                            client_id: order.user.erpClientId as number,
                            order_value: order.total,
                            delivery_value: Number(order.delivery.serviceDelivery.price),
                            return_value: 100,
                            total_value: order.total,
                            delivery_date_time: String(order.delivery.shippingDate),
                            delivery_method,
                            address_attributes: {
                                street: order.delivery.address.street as string,
                                number: String(order.delivery.address.num as number),
                                complement: order.delivery.address.complement as string,
                                district: order.delivery.address.neighborhood as string,
                            },
                            order_items_attributes: bierHeldItems,
                            payments_attributes: [
                                {
                                   pay_type_id: payTypeId,
                                   value: order.total
                                }
                            ]
                        }
                    });

                    if(createdOrderBierHeld instanceof Error){
                        throw new Error('Erro ao criar pedido na bier held')
                    }

                    await this.orderRepository.addBierHeldOrderId(order.id, createdOrderBierHeld.id);

                } catch (error) {
                    console.log(error);
                    console.error('[Consumer - Create order] Erro ao processar mensagem:', error);
                }
            },
        });
    }
}

const createOrderBierHeld = new CreateOrderBierHeld();
createOrderBierHeld.execute();

