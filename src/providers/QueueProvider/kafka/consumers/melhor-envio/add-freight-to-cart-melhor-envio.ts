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
import { IDeliveryRepository } from "@/repositories/interfaces/interface-deliveries-repository";
import { PrismaDeliveryRepository } from "@/repositories/prisma/prisma-deliveries-repository";
import { AppError } from "@/usecases/errors/app-error";
import { IFreightsRepository } from "@/repositories/interfaces/interface-freights-repository";
import { PrismaFreightRepository } from "@/repositories/prisma/prisma-freights-repository";

interface IRelationBox {
    box: Box
}

export class AddFreightToCartMelhorEnvio {
    private kafkaConsumer: KafkaConsumerFreight;
    private railwayProvider: IRailwayProvider;
    private mailProvider: IMailProvider;
    private usersRepository: IUsersRepository;
    private melhorEnvioProvider: IMelhorEnvioProvider;
    private orderRepository: IOrderRepository;
    private deliveryProvider: IDeliveryRepository
    private freightRespository:  IFreightsRepository

    constructor() {
        this.kafkaConsumer = new KafkaConsumerFreight();
        this.railwayProvider = new RailwayProvider();
        this.mailProvider = new MailProvider();
        this.usersRepository = new PrismaUsersRepository();
        this.melhorEnvioProvider = new MelhorEnvioProvider(
            this.railwayProvider,
            this.mailProvider,
            this.usersRepository
        );
        this.orderRepository = new PrismaOrderRepository();
        this.deliveryProvider = new PrismaDeliveryRepository()
        this.freightRespository = new PrismaFreightRepository()
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

                    // * Determinar qual tipo da transportadora porque se for Correio so pode enviar um volume por vez.
                    if(order.delivery.companyName === 'Correios') {
                        const boxToCorreios = order.boxes
                        .map(relation => (relation as unknown as IRelationBox).box)
                        .find(box => box.companyName === 'Correios');

                        if(!boxToCorreios) {
                            throw new AppError('Box not found')
                        }

                        for(let item of order.items) {

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
                                    city: order.delivery.address.city as string,
                                    state_abbr: order.delivery.address.state as string,
                                    postal_code: order.delivery.address.zipCode as string,
                                    address: order.delivery.address.street as string,
                                    country_id: "BR", // Brasil
                                    number: String(order.delivery.address.num),
                                    complement: order.delivery.address.complement as string,
                                    district: order.delivery.address.neighborhood as string,
                                    state_register: '123456789',
                                    document: customer.cpf as string,
                                    note: "order for delivery"
                                },
                                service: Number(order.delivery.serviceId),
                                products: [
                                    {
                                        quantity: Number(item.quantity),
                                        name: item.name as string,
                                        unitary_value: Number(item.price), 
                                    }
                                ],
                                volumes: [
                                    {
                                        height: Number(boxToCorreios.height),
                                        width: Number(boxToCorreios.width),
                                        length: Number(boxToCorreios.length),
                                        weight: Number(boxToCorreios.weight),
                                    }
                                ],
                                options:{
                                    insurance_value: order.items.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0),
                                    non_commercial: true,
                                    own_hand: false,
                                    receipt: false,
                                    reverse: false,
                                    // invoice: {
                                    //     key: "35190812345678000123550010000000011234567890"
                                    // }
                                },
                                
                            });

                            if(!freightInCart) {
                                throw new AppError('Freight not added to cart')
                            }

                            await this.freightRespository.save(order.delivery.id, freightInCart.id);
                            
                            // Atualizar status do pedido e informações relacionadas
                            await this.orderRepository.updateStatus(order.id, Status.AWAITING_LABEL_PAYMENT_PROCESS);
                        }

                        console.info('[Consumer - Freight] Frete adicionado ao carrinho com sucesso.');
                        return

                    }

                   
                    const boxToNotCorreios = order.boxes
                    .map(relation => (relation as unknown as IRelationBox).box)

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
                            city: order.delivery.address.city as string,
                            state_abbr: order.delivery.address.state as string,
                            postal_code: order.delivery.address.zipCode as string,
                            address: order.delivery.address.street as string,
                            country_id: "BR", // Brasil
                            number: String(order.delivery.address.num),
                            complement: order.delivery.address.complement as string,
                            district: order.delivery.address.neighborhood as string,
                            state_register: '123456789',
                            document: customer.cpf as string,
                            note: "order for delivery"
                        },
                        service: Number(order.delivery.serviceId),
                        products: order.items.map(item => {
                            return{
                                quantity: Number(item.quantity),
                                name: item.name as string,
                                unitary_value: Number(item.price),
                            }
                        }),
                        volumes: boxToNotCorreios.map(box => {
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
                            reverse: false,
                            // invoice: {
                            //     key: "35190812345678000123550010000000011234567890"
                            // }
                        },
                        
                    });
                    if(!freightInCart) {
                        console.error('[Consumer - Freight] Erro ao adicionar frete ao carrinho.');
                        return;
                    }

                    // Adicionar frete ao pedido
                    await this.freightRespository.save(order.delivery.id, freightInCart.id);
                    
                    // Atualizar status do pedido e informações relacionadas
                    await this.orderRepository.updateStatus(order.id, Status.AWAITING_LABEL_PAYMENT_PROCESS);

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

