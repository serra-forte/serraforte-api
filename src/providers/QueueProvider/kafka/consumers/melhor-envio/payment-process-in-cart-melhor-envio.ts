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
import { Box, Status } from "@prisma/client";
import { KafkaProducer } from "../../kafka-producer";

interface IRelationBox {
    box: Box
}

export class PaymentProcessInCartMelhorEnvio {
    private kafkaConsumer: KafkaConsumer;
    private kafkaProducer: KafkaProducer;
    private railwayProvider: IRailwayProvider;
    private mailProvider: IMailProvider;
    private usersRepository: IUsersRepository;
    private melhorEnvioProvider: IMelhorEnvioProvider;
    private orderRepository: IOrderRepository;

    constructor() {
        this.kafkaConsumer = new KafkaConsumer();
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
        const createdConsumer = await this.kafkaConsumer.execute('payment-process-in-cart');

        createdConsumer.run({
            eachMessage: async ({ message }) => {
                if (!message || !message.value) {
                    console.warn('[Consumer - Payment] Mensagem vazia ou inválida:', message);
                    return;
                }

                try {
                    const parsedMessage = JSON.parse(message.value.toString());
                    console.log('[Consumer - Payment] Mensagem recebida:', parsedMessage);

                    if (!parsedMessage.items || !Array.isArray(parsedMessage.items) || parsedMessage.items.length === 0) {
                        console.warn('[Consumer - Payment] Itens do pedido estão ausentes ou inválidos.');
                        return;
                    }


                } catch (error) {
                    console.error('[Consumer ] Erro ao processar mensagem:', error);
                }
            },
        });
    }
    
}
