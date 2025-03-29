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
import { AppError } from "@/usecases/errors/app-error";
import { Status } from "@prisma/client";
import { env } from "@/env";
import { KafkaConsumerGenerateTrackingLink } from "../../kafka-consumer-generate-tracking-link";
import { IDeliveryRepository } from "@/repositories/interfaces/interface-deliveries-repository";
import { PrismaDeliveryRepository } from "@/repositories/prisma/prisma-deliveries-repository";
import { PrismaFreightRepository } from "@/repositories/prisma/prisma-freights-repository";
import { IFreightsRepository } from "@/repositories/interfaces/interface-freights-repository";

export class GenerateTrackingLinkMelhorEnvio {
    private kafkaConsumer: KafkaConsumerGenerateTrackingLink;
    private railwayProvider: IRailwayProvider;
    private mailProvider: IMailProvider;
    private usersRepository: IUsersRepository;
    private melhorEnvioProvider: IMelhorEnvioProvider;
    private orderRepository: IOrderRepository;
    private deliveryRepository: IDeliveryRepository
    private freightRespository:  IFreightsRepository

    constructor() {
        this.kafkaConsumer = new KafkaConsumerGenerateTrackingLink();
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
        this.freightRespository = new PrismaFreightRepository()
    }

    async execute() {
        const createdConsumer = await this.kafkaConsumer.execute('GENERATE_TRACKING_LINK');

        createdConsumer.run({
            eachMessage: async ({ message }) => {
                if (!message || !message.value) {
                    console.warn('[Consumer - Generate Tracking Link] Mensagem vazia ou inválida.');
                    return;
                }

                try {
                    const parsedMessage = JSON.parse(message.value.toString());

                    if (!parsedMessage) return;

                    const responseShipmentTracking = await this.melhorEnvioProvider.getShipmentTracking(parsedMessage.freightId);
                    if (!responseShipmentTracking) {
                        throw new AppError('Erro ao buscar informações da etiqueta');
                    }

                    const objectTracking = Object.values(responseShipmentTracking);
                    
                    const trackingLink = `${env.MELHOR_ENVIO_TRANCKING_LINK}/${objectTracking[0].tracking}/${parsedMessage.self_tracking}`;
                    
                    const delivery = await this.deliveryRepository.findById(parsedMessage.deliveryId)

                    if (!delivery) {
                        throw new AppError('Entrega nao encontrada', 404);
                    }

                    
                    await this.freightRespository.save(delivery.orderId, {
                        trackingLink
                    });

                    console.info('[Consumer - Generate Tracking Link] Link do frete gerado com sucesso');
                } catch (error) {
                    console.error('[Consumer - Generate Tracking Link] Erro ao processar mensagem:', error);
                }
            },
        });
    }
}

const generateTrackingLinkMelhorEnvio = new GenerateTrackingLinkMelhorEnvio();
generateTrackingLinkMelhorEnvio.execute();