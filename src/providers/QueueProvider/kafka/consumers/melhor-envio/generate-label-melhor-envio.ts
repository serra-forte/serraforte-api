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
import { KafkaConsumerGenerateLabel } from "../../kafka-consumer-generate-label";
import { Status } from "@prisma/client";
import { IDeliveryRepository } from "@/repositories/interfaces/interface-deliveries-repository";
import { PrismaDeliveryRepository } from "@/repositories/prisma/prisma-deliveries-repository";
import { AppError } from "@/usecases/errors/app-error";

export interface IGenerateLabelLink {
    orderId: string;
    freightId: string;
}
export class GenerateFreightMelhorEnvio {
    private kafkaConsumer: KafkaConsumerGenerateLabel;
    private railwayProvider: IRailwayProvider;
    private mailProvider: IMailProvider;
    private usersRepository: IUsersRepository;
    private melhorEnvioProvider: IMelhorEnvioProvider;
    private orderRepository: IOrderRepository;
    private deliveryRepository: IDeliveryRepository

    constructor() {
        this.kafkaConsumer = new KafkaConsumerGenerateLabel();
        this.railwayProvider = new RailwayProvider();
        this.mailProvider = new MailProvider();
        this.usersRepository = new PrismaUsersRepository();
        this.melhorEnvioProvider = new MelhorEnvioProvider(
            this.railwayProvider,
            this.mailProvider,
            this.usersRepository
        );
        this.orderRepository = new PrismaOrderRepository();
        this.deliveryRepository = new PrismaDeliveryRepository()
    }

    async execute() {
        const createdConsumer = await this.kafkaConsumer.execute('GENERATE_LABEL');

        createdConsumer.run({
            eachMessage: async ({ message }) => {
                if (!message || !message.value) {
                    console.warn('[Consumer - Generate Label] Mensagem vazia ou inválida:');
                    return;
                }

                try {
                    const parsedMessage = JSON.parse(message.value.toString());
                    console.log('[Consumer - Generate Label] Mensagem recebida:');

                    if (!parsedMessage) {
                        // console.warn('[Consumer - Payment] Itens do pedido estão ausentes ou inválidos.');
                        return;
                    }

                    // gerar etiqueta na melhor envio
                    await this.melhorEnvioProvider.generateLabel(parsedMessage.freightId)


                    const delivery = await this.deliveryRepository.findById(parsedMessage.deliveryId)

                    if (!delivery) {
                        throw new AppError('Entrega nao encontrada', 404);
                    }

                    // atualizar pedido com status "AWAITING_LABEL_LINK"
                    await this.orderRepository.updateStatus(delivery.orderId, Status.AWAITING_LABEL_LINK)

                    console.info('[Consumer - Generate Label] Frete gerado com sucesso');
                } catch (error) {
                    console.error('[Consumer - Generate Label ] Erro ao processar mensagem:', error);
                }
            },
        });
    }
    
}

const generateFreightMelhorEnvio = new GenerateFreightMelhorEnvio();
generateFreightMelhorEnvio.execute();