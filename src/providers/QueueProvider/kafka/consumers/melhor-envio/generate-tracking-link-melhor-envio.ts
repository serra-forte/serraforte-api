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
import { AppError } from "@/usecases/errors/app-error";
import { Status } from "@prisma/client";
import { env } from "@/env";
import { KafkaConsumerGenerateTrackingLink } from "../../kafka-consumer-generate-tracking-link";

export class GenerateTrackingLinkMelhorEnvio {
    private kafkaConsumer: KafkaConsumerGenerateTrackingLink;
    private railwayProvider: IRailwayProvider;
    private mailProvider: IMailProvider;
    private usersRepository: IUsersRepository;
    private melhorEnvioProvider: IMelhorEnvioProvider;
    private orderRepository: IOrderRepository;

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
                    console.log('[Consumer - Generate Tracking Link] Mensagem recebida:', parsedMessage);

                    if (!parsedMessage) return;

                    const responseShipmentTracking = await this.melhorEnvioProvider.getShipmentTracking(parsedMessage.freightId);
                    if (!responseShipmentTracking) {
                        throw new AppError('Erro ao buscar informações da etiqueta');
                    }

                    const objectTracking = Object.values(responseShipmentTracking);
                    if (objectTracking[0].status !== 'posted') {
                        const isPosted = await this.checkStatusLabel(parsedMessage.orderId, objectTracking[0].id);
                        if (isPosted) {
                            console.info('[Consumer - Generate Tracking Link] Status da etiqueta gerada: posted');
                            const trackingLink = `${env.MELHOR_ENVIO_TRANCKING_LINK}/${objectTracking[0].tracking}`;
                            await this.orderRepository.saveTrackingLink(parsedMessage.orderId, trackingLink);
                        }
                    }
                } catch (error) {
                    console.error('[Consumer - Generate Tracking Link] Erro ao processar mensagem:', error);
                }
            },
        });
    }

    private async checkStatusLabel(orderId: string, shipmentId: string, tentativas = 5) {
        for (let i = 0; i < tentativas; i++) {
            console.log(`[checkStatusLabel] Tentativa ${i + 1} de ${tentativas} para shipmentId: ${shipmentId}`);
            const responseShipmentTracking = await this.melhorEnvioProvider.getShipmentTracking(shipmentId);

            if (!responseShipmentTracking) {
                console.error('[checkStatusLabel] Erro ao buscar informações da etiqueta. Tentando novamente...');
                continue;
            }

            const objectTracking = Object.values(responseShipmentTracking);
            console.log(`[checkStatusLabel] Status atual da etiqueta: ${objectTracking[0].status}`);
            
            if (objectTracking[0].status === 'posted') {
                await this.orderRepository.updateStatus(orderId, Status.TRACK_LINK_GENERATED);
                return true;
            }
            
            console.log('[checkStatusLabel] Aguardando 5 minutos antes da próxima tentativa...');
            await new Promise((resolve) => setTimeout(resolve, 5 * 60 * 1000));
        }

        console.warn(`⚠️ Atenção! A etiqueta ${shipmentId} ainda não foi gerada.`);
        await this.orderRepository.updateStatus(orderId, Status.BROKE_GENERATED_LABEL);
        return false;
    }
}

const generateTrackingLinkMelhorEnvio = new GenerateTrackingLinkMelhorEnvio();
generateTrackingLinkMelhorEnvio.execute();