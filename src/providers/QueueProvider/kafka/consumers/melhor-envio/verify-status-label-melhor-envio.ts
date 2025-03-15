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
import { KafkaConsumerGenerateLabelLink } from "../../kafka-consumer-generate-label-link";
import { env } from "@/env";
import { IGenerateLabelLink } from "./generate-freight-merlho-envio";

export class VerifyStatusLabelMelhorEnvio {
    private kafkaConsumer: KafkaConsumerGenerateLabelLink;
    private railwayProvider: IRailwayProvider;
    private mailProvider: IMailProvider;
    private usersRepository: IUsersRepository;
    private melhorEnvioProvider: IMelhorEnvioProvider;
    private orderRepository: IOrderRepository;
    private kafkaProducer: KafkaProducer;

    constructor() {
        this.kafkaConsumer = new KafkaConsumerGenerateLabelLink();
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
        const createdConsumer = await this.kafkaConsumer.execute('VERIFY_STATUS_LABEL');

        createdConsumer.run({
            eachMessage: async ({ message }) => {
                if (!message || !message.value) {
                    console.warn('[Consumer - Verify Status Label] Mensagem vazia ou inválida:');
                    return;
                }

                try {
                    const parsedMessage = JSON.parse(message.value.toString());
                    console.log('[Consumer - Verify Status Label] Mensagem recebida:');

                    if (!parsedMessage) {
                        return;
                    }

                    // gerar etiqueta na melhor envio
                    const responseShipmentTracking = await this.melhorEnvioProvider.getShipmentTracking(parsedMessage.freightId)

                    if (!responseShipmentTracking) {
                        throw new AppError('Erro ao buscar informações da etiqueta');
                    }

                    const objectTracking = Object.values(responseShipmentTracking)

                    if(objectTracking[0].status !== 'posted') {
                        // esperar por 5 minutos durante 4 tentativas
                        const isPosted = await this.verificarStatusAteGerado(objectTracking[0].id)

                       if(isPosted){
                        const infoToGenerateLabelLink: IGenerateLabelLink = {
                            freightId: parsedMessage.freightId,
                            orderId: parsedMessage.orderId
                        }

                        await this.kafkaProducer.execute('GENERATE_LABEL_LINK', infoToGenerateLabelLink)

                        console.info('[Consumer - Verify Status Label] Status da etiqueta gerada: posted');
                       }
                    }
                 
                } catch (error) {
                    console.error('[Consumer - Verify Status Label ] Erro ao processar mensagem:', error);
                }
            },
        });
    }

    private async verificarStatusAteGerado(shipmentId: string, tentativas = 5) {
        for (let i = 0; i < tentativas; i++) {
           // gerar etiqueta na melhor envio
           const responseShipmentTracking = await this.melhorEnvioProvider.getShipmentTracking(shipmentId)

           if (!responseShipmentTracking) {
               throw new AppError('Erro ao buscar informações da etiqueta');
           }

           const objectTracking = Object.values(responseShipmentTracking)

      
          if (objectTracking[0].status === 'posted' || objectTracking[0].status === 'generated') {
            console.log(`✅ Status atualizado para: ${objectTracking[0].status}`);
            return true;
          }
      
          await new Promise((resolve) => setTimeout(resolve, 5 * 60 * 1000));
        }
      
        console.log(`⚠️ Atenção! A etiqueta ${shipmentId} ainda não foi gerada.`);
        // alterar status no banco com status pendente

        return false
      }
    
}

const verifyStatusLabelMelhorEnvio = new VerifyStatusLabelMelhorEnvio();
verifyStatusLabelMelhorEnvio.execute();