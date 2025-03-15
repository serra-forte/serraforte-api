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
import { KafkaProducer } from "../../kafka-producer";
import { KafkaConsumerGenerateFreight } from "../../kafka-consumer-generate-freight";
import { AppError } from "@/usecases/errors/app-error";
import { Status } from "@prisma/client";

export interface IGenerateLabelLink {
    orderId: string;
    freightId: string;
}
export class GenerateFreightMelhorEnvio {
    private kafkaConsumer: KafkaConsumerGenerateFreight;
    private kafkaProducer: KafkaProducer;
    private railwayProvider: IRailwayProvider;
    private mailProvider: IMailProvider;
    private usersRepository: IUsersRepository;
    private melhorEnvioProvider: IMelhorEnvioProvider;
    private orderRepository: IOrderRepository;

    constructor() {
        this.kafkaConsumer = new KafkaConsumerGenerateFreight();
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
        const createdConsumer = await this.kafkaConsumer.execute('GENERATE_LABEL');

        createdConsumer.run({
            eachMessage: async ({ message }) => {
                if (!message || !message.value) {
                    console.warn('[Consumer - Generate Freight] Mensagem vazia ou inválida:');
                    return;
                }

                try {
                    const parsedMessage = JSON.parse(message.value.toString());
                    console.log('[Consumer - Generate Freight] Mensagem recebida:');

                    if (!parsedMessage) {
                        // console.warn('[Consumer - Payment] Itens do pedido estão ausentes ou inválidos.');
                        return;
                    }

                    // gerar etiqueta na melhor envio
                    const labelTracking = await this.melhorEnvioProvider.generateLabelTracking(parsedMessage.freightId)

                    const infoToGenerateLabelLink: IGenerateLabelLink = {
                        freightId: parsedMessage.freightId,
                        orderId: parsedMessage.orderId
                    }

                    // atualizar pedido com status "AWAITING_LABEL_LINK"
                    await this.orderRepository.updateStatus(parsedMessage.orderId, Status.AWAITING_LABEL_LINK)

                    // criar enviar id da etiqueta para a melhor envio gerar o link da etiqueta
                    await this.kafkaProducer.execute('GENERATE_LABEL_LINK', infoToGenerateLabelLink)

                    console.info('[Consumer - Generate Freight] Frete gerado com sucesso');
                } catch (error) {
                    console.error('[Consumer - Generate Freight ] Erro ao processar mensagem:', error);
                }
            },
        });
    }
    
}

const generateFreightMelhorEnvio = new GenerateFreightMelhorEnvio();
generateFreightMelhorEnvio.execute();