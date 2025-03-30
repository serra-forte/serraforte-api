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
import { KafkaConsumerGenerateLabelToPrint } from "../../kafka-consumer-generate-label-to-print";
import { IFreightsRepository } from "@/repositories/interfaces/interface-freights-repository";
import { PrismaFreightRepository } from "@/repositories/prisma/prisma-freights-repository";

export class GenerateLabelLinkMelhorEnvio {
    private kafkaConsumer: KafkaConsumerGenerateLabelToPrint;
    private railwayProvider: IRailwayProvider;
    private mailProvider: IMailProvider;
    private usersRepository: IUsersRepository;
    private melhorEnvioProvider: IMelhorEnvioProvider;
    private orderRepository: IOrderRepository;
    private freightRespository:  IFreightsRepository

    constructor() {
        this.kafkaConsumer = new KafkaConsumerGenerateLabelToPrint();
        this.railwayProvider = new RailwayProvider();
        this.mailProvider = new MailProvider();
        this.usersRepository = new PrismaUsersRepository();
        this.melhorEnvioProvider = new MelhorEnvioProvider(
            this.railwayProvider,
            this.mailProvider,
            this.usersRepository
        );
        this.orderRepository = new PrismaOrderRepository();
        this.freightRespository = new PrismaFreightRepository()
    }

    async execute() {
        const createdConsumer = await this.kafkaConsumer.execute('GENERATE_LABEL_TO_PRINT');

        createdConsumer.run({
            eachMessage: async ({ message }) => {
                if (!message || !message.value) {
                    console.warn('[Consumer - Generate Label Link] Mensagem vazia ou inválida:');
                    return;
                }

                try {
                    const parsedMessage = JSON.parse(message.value.toString());
                    console.log('[Consumer - Generate Label Link] Mensagem recebida:');

                    if (!parsedMessage) {
                        // console.warn('[Consumer - Payment] Itens do pedido estão ausentes ou inválidos.');
                        return;
                    }

                    // gerar etiqueta na melhor envio
                    const response = await this.melhorEnvioProvider.generateLabelLinkToPrinting(parsedMessage.freightId)

                    if (!response) {
                        throw new AppError('Erro ao gerar link da etiqueta');
                    }

                    console.log(response)

                    await this.freightRespository.save({
                        freightId: parsedMessage.freightId,
                        freightLink: response.url
                    })

                    await this.orderRepository.updateStatus(parsedMessage.orderId, Status.LABEL_GENERATED)

                    console.info('[Consumer - Generate Label Link] Link do frete gerado com sucesso');
                } catch (error) {
                    console.error('[Consumer - Generate Label Link ] Erro ao processar mensagem:', error);
                }
            },
        });
    }
    
}

const generateLabelLinkMelhorEnvio = new GenerateLabelLinkMelhorEnvio();
generateLabelLinkMelhorEnvio.execute();