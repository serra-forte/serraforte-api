import { IMelhorEnvioProvider } from "@/providers/DeliveryProvider/interface-melhor-envio-provider";
import { KafkaConsumer } from "../../kafka-consumer";
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
import { Box } from "@prisma/client";

interface IRelationBox {
    box: Box
}

export class AddFreightToCartMelhorEnvio {
    private kafkaConsumer: KafkaConsumer;
    private railwayProvider: IRailwayProvider;
    private mailProvider: IMailProvider;
    private usersRepository: IUsersRepository;
    private melhorEnvioProvider: IMelhorEnvioProvider;
    private orderRepository: IOrderRepository;

    constructor() {
        this.kafkaConsumer = new KafkaConsumer();
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
        const createdConsumer = await this.kafkaConsumer.execute('add-freight-to-cart');

        createdConsumer.run({
            eachMessage: async ({ message }) => {
                if (!message || !message.value) {
                    console.warn('[Consumer] Mensagem vazia ou inválida:', message);
                    return;
                }

                try {
                    const parsedMessage = JSON.parse(message.value.toString());
                    console.log('[Consumer] Mensagem recebida:', parsedMessage);

                    if (!parsedMessage.items || !Array.isArray(parsedMessage.items) || parsedMessage.items.length === 0) {
                        console.warn('[Consumer] Itens do pedido estão ausentes ou inválidos.');
                        return;
                    }

                    const order = parsedMessage as IOrderRelationsDTO;
                    console.log('[Consumer] Pedido:', order);
                    // Buscar lojista pelo ID do primeiro item
                    const shopkeeper = await this.usersRepository.findById(order.items[0].userId as string) as unknown as IUserRelations;
                    if (!shopkeeper || !shopkeeper.address) {
                        console.error('[Consumer] Lojista não encontrado ou endereço inválido.');
                        return;
                    }

                    // Buscar cliente pelo ID do pedido
                    const customer = await this.usersRepository.findById(order.user.id as string) as unknown as IUserRelations;
                    if (!customer || !customer.address) {
                        console.error('[Consumer] Cliente não encontrado ou endereço inválido.');
                        return;
                    }

                    console.log(order.boxes);

                    const [box] = order.boxes.map(objWithBox => {
                        const {box} = objWithBox as unknown as IRelationBox;

                        return box
                    })

                    // Determinar qual caixa vai ser usada

                    // Lógica de envio do frete
                    await this.melhorEnvioProvider.addFreightToCart({
                        from: {
                            name: shopkeeper.name,
                            email: shopkeeper.email,
                            phone: shopkeeper.phone,
                            city: shopkeeper.address.city,
                            state_abbr: shopkeeper.address.state as string,
                            postal_code: shopkeeper.address.zipCode as string,
                            address: shopkeeper.address.street,
                            country_id: "55", // Brasil
                            number: String(shopkeeper.address.num),
                            complement: shopkeeper.address.complement as string,
                            district: shopkeeper.address.neighborhood as string,
                            state_register: '12345678910',
                            document: shopkeeper.cpf as string,
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
                            country_id: "55", // Brasil
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
                        volumes: order.boxes.map(objeWithBox => {
                            const {box} = objeWithBox as unknown as IRelationBox;

                            return{
                                width: Number(box.width),
                                height: Number(box.height),
                                length: Number(box.length),
                                weight: Number(box.weight),
                            }
                        }),
                        options:{
                            insuranceValue: 0,
                            non_commercial: false,
                            own_hand: false,
                            receipt: false,
                            reverse: false
                        }
                    });

                    console.info('[Consumer] Frete adicionado ao carrinho com sucesso.');

                    // Atualizar status do pedido e informações relacionadas
                    // await this.orderRepository.updateStatus(order.id, "AWAITING_LABEL_PAYMENT_PROCESS");

                } catch (error) {
                    console.error('[Consumer] Erro ao processar mensagem:', error);
                }
            },
        });
    }
}

const kafkaConsumer = new AddFreightToCartMelhorEnvio();
kafkaConsumer.execute();
