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
import { Package } from "./separeta-package-melhor-envio";

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

                    if (!parsedMessage.packages || !Array.isArray(parsedMessage.packages) || parsedMessage.packages.length === 0) {
                        console.warn('[Consumer - Freight] Pacotes estão ausentes ou inválidos.');
                        return;
                    }

                    const packages = parsedMessage as Package[];

                    const shopkeeper = await this.usersRepository.findById(packages[0].shopkeeperId) as unknown as IUserRelations;
                    if (!shopkeeper || !shopkeeper.address) {
                        console.error('[Consumer - Freight] Lojista não encontrado ou endereço inválido.');
                        return;
                    }

                    for(let itemPackage of packages) {
                        const customer = await this.usersRepository.findById(itemPackage.clientId) as unknown as IUserRelations;
                        if (!customer || !customer.address) {
                            console.error('[Consumer - Freight] Cliente não encontrado ou endereço inválido.');
                            return;
                        }

                        if(itemPackage.companyName === 'Correios') {
                            for(let item of itemPackage.items) {
                                const freightInCart = await this.melhorEnvioProvider.addFreightToCart({
                                    from: {
                                        name: shopkeeper.name,
                                        phone: shopkeeper.phone,
                                        email: shopkeeper.email,
                                        document: shopkeeper.cpf as string,
                                        state_register: '12345678910',
                                        address: shopkeeper.address.street as string,
                                        complement: shopkeeper.address.complement as string,
                                        number: String(shopkeeper.address.num),
                                        district: shopkeeper.address.neighborhood as string,
                                        city: shopkeeper.address.city as string,
                                        country_id: "BR", // Brasill
                                        postal_code: shopkeeper.address.zipCode as string,
                                        state_abbr: shopkeeper.address.state as string,
                                        note: "order for delivery"
                                    },
                                    to: {
                                        name: customer.name,
                                        email: customer.email,
                                        phone: customer.phone,
                                        city: itemPackage.address.city as string,
                                        state_abbr: itemPackage.address.state as string,
                                        postal_code: itemPackage.address.zipCode as string,
                                        address: itemPackage.address.street as string,
                                        country_id: "BR", // Brasil
                                        number: String(itemPackage.address.num),
                                        complement: itemPackage.address.complement as string,
                                        district: itemPackage.address.neighborhood as string,
                                        state_register: '123456789',
                                        document: customer.cpf as string,
                                        note: "order for delivery"
                                    },
                                    service: itemPackage.serviceId,
                                    products: [
                                        {
                                            name: item.name,
                                            quantity: Number(item.quantity),
                                            unitary_value: Number(item.price)
                                        }
                                    ],
                                    volumes: [
                                        {
                                            width: item.width,
                                            height: item.height,
                                            length: item.length,
                                            weight: item.weight
                                        }
                                    ],
                                    options:{
                                        insurance_value: itemPackage.total,
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
    
                                await this.freightRespository.create({
                                    freightId: freightInCart.id,
                                    deliveryId: itemPackage.deliveryId,
                                    price: freightInCart.price
                                });
                                
                                // Atualizar status do pedido e informações relacionadas
                                await this.orderRepository.updateStatus(itemPackage.orderId, Status.AWAITING_LABEL_PAYMENT_PROCESS);
                            }
    
                            console.info('[Consumer - Freight] Frete adicionado ao carrinho com sucesso.');
                            return
    
                        }else{
                            const freightInCart = await this.melhorEnvioProvider.addFreightToCart({
                                from: {
                                    name: shopkeeper.name,
                                    phone: shopkeeper.phone,
                                    email: shopkeeper.email,
                                    document: shopkeeper.cpf as string,
                                    state_register: '12345678910',
                                    address: shopkeeper.address.street as string,
                                    complement: shopkeeper.address.complement as string,
                                    number: String(shopkeeper.address.num),
                                    district: shopkeeper.address.neighborhood as string,
                                    city: shopkeeper.address.city as string,
                                    country_id: "BR", // Brasill
                                    postal_code: shopkeeper.address.zipCode as string,
                                    state_abbr: shopkeeper.address.state as string,
                                    note: "order for delivery"
                                },
                                to: {
                                    name: customer.name,
                                    email: customer.email,
                                    phone: customer.phone,
                                    city: itemPackage.address.city as string,
                                    state_abbr: itemPackage.address.state as string,
                                    postal_code: itemPackage.address.zipCode as string,
                                    address: itemPackage.address.street as string,
                                    country_id: "BR", // Brasil
                                    number: String(itemPackage.address.num),
                                    complement: itemPackage.address.complement as string,
                                    district: itemPackage.address.neighborhood as string,
                                    state_register: '123456789',
                                    document: customer.cpf as string,
                                    note: "order for delivery"
                                },
                                service: itemPackage.serviceId,
                                products: itemPackage.items.map(item => {
                                    return{
                                        quantity: Number(item.quantity),
                                        name: item.name as string,
                                        unitary_value: Number(item.price),
                                    }
                                }),
                                volumes: itemPackage.items.map(item => {
                                    return({
                                        width: item.width,
                                        height: item.height,
                                        length: item.length,
                                        weight: item.weight
                                    })
                                }),
                                options:{
                                    insurance_value: itemPackage.total,
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
                            await this.freightRespository.create({
                                freightId: freightInCart.id,
                                deliveryId: itemPackage.deliveryId,
                                price: freightInCart.price
                            });
                            
                            // Atualizar status do pedido e informações relacionadas
                            await this.orderRepository.updateStatus(itemPackage.orderId, Status.AWAITING_LABEL_PAYMENT_PROCESS);

                        }
                    }
                } catch (error) {
                    console.error('[Consumer - Freight] Erro ao processar mensagem:', error);
                }
            },
        });
    }
}

const addFreightToCartMelhorEnvio = new AddFreightToCartMelhorEnvio();
addFreightToCartMelhorEnvio.execute();

