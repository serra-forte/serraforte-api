import { IMelhorEnvioProvider } from "@/providers/DeliveryProvider/interface-melhor-envio-provider";
import { MelhorEnvioProvider } from "@/providers/DeliveryProvider/implementations/provider-melhor-envio";
import { IRailwayProvider } from "@/providers/RailwayProvider/interface-railway-provider";
import { IMailProvider } from "@/providers/MailProvider/interface-mail-provider";
import { IUsersRepository } from "@/repositories/interfaces/interface-users-repository";
import { RailwayProvider } from "@/providers/RailwayProvider/implementations/provider-railway";
import { MailProvider } from "@/providers/MailProvider/implementations/provider-sendgrid";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { IOrderRepository } from "@/repositories/interfaces/interface-order-repository";
import { PrismaOrderRepository } from "@/repositories/prisma/prisma-orders-repository";
import { IOrderRelationsDTO } from "@/dtos/order-relations.dto";
import { IUserRelations } from "@/dtos/user-relations.dto";
import { Box, Status } from "@prisma/client";
import { KafkaProducer } from "../../kafka-producer";
import { KafkaConsumerFreight } from "../../kafka-consumer-freight";

interface IRelationBox {
    box: Box
}

export class AddFreightToCartMelhorEnvio {
    private kafkaConsumer: KafkaConsumerFreight;
    private kafkaProducer: KafkaProducer;
    private railwayProvider: IRailwayProvider;
    private mailProvider: IMailProvider;
    private usersRepository: IUsersRepository;
    private melhorEnvioProvider: IMelhorEnvioProvider;
    private orderRepository: IOrderRepository;

    constructor() {
        this.kafkaConsumer = new KafkaConsumerFreight();
        this.kafkaProducer = new KafkaProducer();
        this.railwayProvider = new RailwayProvider();
        this.mailProvider = new MailProvider();
        this.usersRepository = new PrismaUsersRepository();
        this.melhorEnvioProvider = new MelhorEnvioProvider(
            this.railwayProvider,
            this.mailProvider,
            this.usersRepository
        );
        this.orderRepository = new PrismaOrderRepository();
    }

    async execute() {
        const createdConsumer = await this.kafkaConsumer.execute('ADD_FREIGHT_TO_CART');

        createdConsumer.run({
            eachMessage: async ({ message }) => {
                if (!message || !message.value) {
                    console.warn('[Consumer - Freight] Mensagem vazia ou inválida:', message);
                    return;
                }

                try {
                    const parsedMessage = JSON.parse(message.value.toString());
                    console.log('[Consumer - Freight] Mensagem recebida:');

                    if (!parsedMessage.items || !Array.isArray(parsedMessage.items) || parsedMessage.items.length === 0) {
                        // console.warn('[Consumer - Freight] Itens do pedido estão ausentes ou inválidos.');
                        return;
                    }

                    const order = parsedMessage as IOrderRelationsDTO;
                    // Buscar lojista pelo ID do primeiro item
                    const shopkeeper = await this.usersRepository.findById(order.items[0].userId as string) as unknown as IUserRelations;
                    if (!shopkeeper || !shopkeeper.address) {
                        console.error('[Consumer - Freight] Lojista não encontrado ou endereço inválido.');
                        return;
                    }

                    // Buscar cliente pelo ID do pedido
                    const customer = await this.usersRepository.findById(order.user.id as string) as unknown as IUserRelations;
                    if (!customer || !customer.address) {
                        console.error('[Consumer - Freight] Cliente não encontrado ou endereço inválido.');
                        return;
                    }

                    let boxes = []

                    for(let relationWithBox of order.boxes){
                        const {box} = relationWithBox as unknown as IRelationBox;

                        boxes.push(box)
                    }

                    // * Determinar qual caixa vai ser usada
                    // if(order.delivery.companyName.includes('Correios')) {
                    //     // Correios
                        // let rightBox = {}

                        // for(let box of boxes) {
                        //     rightBox = Object.assign({}, box)
                        // }

                    // }

                    // * Determinar qual tipo da transportadora porque se for Correio so pode enviar um volume por vez.

                    // Lógica de envio do frete
                    const freightInCart = await this.melhorEnvioProvider.addFreightToCart({
                        from: {
                            name: shopkeeper.name,
                            phone: shopkeeper.phone,
                            email: shopkeeper.email,
                            document: shopkeeper.cpf as string,
                            state_register: '12345678910',
                            address: shopkeeper.address.street,
                            complement: shopkeeper.address.complement as string,
                            number: String(shopkeeper.address.num),
                            district: shopkeeper.address.neighborhood as string,
                            city: shopkeeper.address.city,
                            country_id: "BR", // Brasill
                            postal_code: shopkeeper.address.zipCode as string,
                            state_abbr: shopkeeper.address.state as string,
                            note: "order for delivery"
                        },
                        to: {
                            name: customer.name,
                            email: customer.email,
                            phone: customer.phone,
                            city: customer.address.city,
                            state_abbr: customer.address.state as string,
                            postal_code: customer.address.zipCode as string,
                            address: customer.address.street,
                            country_id: "BR", // Brasil
                            number: String(customer.address.num),
                            complement: customer.address.complement as string,
                            district: customer.address.neighborhood as string,
                            state_register: '123456789',
                            document: customer.cpf as string,
                            note: "order for delivery"
                        },
                        service: Number(order.delivery.serviceId),
                        products: order.items.map(item => {
                            return{
                                id: item.productId,
                                quantity: Number(item.quantity),
                                name: item.name as string,
                                price: Number(item.price),
                                weight: Number(item.weight),
                            }
                        }),
                        volumes: boxes.map(box => {
                            return{
                                length: Number(box.length),
                                width: Number(box.width),
                                height: Number(box.height),
                                weight: Number(box.weight),
                            }
                        }),
                        options:{
                            insurance_value: order.items.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0),
                            non_commercial: true,
                            own_hand: false,
                            receipt: false,
                            reverse: false
                        }
                    });

                    if(!freightInCart) {
                        console.error('[Consumer - Freight] Erro ao adicionar frete ao carrinho.');
                        return;
                    }

                    // Atualizar status do pedido e informações relacionadas
                    await this.orderRepository.updateStatus(order.id, Status.AWAITING_LABEL_PAYMENT_PROCESS);

                    const freightToPayment = {
                        orderId: order.id,
                        freightId: freightInCart.id,
                    }

                    // Enviar mensagem para o Kafka para processar o pagamento
                    await this.kafkaProducer.execute('PAYMENT_PROCESS_IN_CART', freightToPayment)
                   
                    console.info('[Consumer - Freight] Frete adicionado ao carrinho com sucesso.');
                } catch (error) {
                    console.error('[Consumer - Freight] Erro ao processar mensagem:', error);
                }
            },
        });
    }
}

const addFreightToCartMelhorEnvio = new AddFreightToCartMelhorEnvio();
addFreightToCartMelhorEnvio.execute();

