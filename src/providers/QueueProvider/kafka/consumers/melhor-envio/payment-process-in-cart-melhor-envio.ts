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
import { KafkaConsumerPaymentToLabel } from "../../kafka-consumer-payment";
import { Status } from "@prisma/client";
import { AppError } from "@/usecases/errors/app-error";

interface IInfoGenerateLabelFreight {
    orderId: string;
    freightId: string;
}
interface IPaymentProcessInCartMelhorEnvio {
    orderId: string;
    freightId: string;
}
export class PaymentProcessInCartMelhorEnvio {
    private kafkaConsumer: KafkaConsumerPaymentToLabel;
    private kafkaProducer: KafkaProducer;
    private railwayProvider: IRailwayProvider;
    private mailProvider: IMailProvider;
    private usersRepository: IUsersRepository;
    private melhorEnvioProvider: IMelhorEnvioProvider;
    private orderRepository: IOrderRepository;

    constructor() {
        this.kafkaConsumer = new KafkaConsumerPaymentToLabel();
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
        const createdConsumer = await this.kafkaConsumer.execute('PAYMENT_PROCESS_IN_CART');

        createdConsumer.run({
            eachMessage: async ({ message }) => {
                if (!message || !message.value) {
                    console.warn('[Consumer - Payment] Mensagem vazia ou inválida:');
                    return;
                }

                try {
                    const parsedMessage = JSON.parse(message.value.toString());
                    console.log('[Consumer - Payment] Mensagem recebida:');

                    if (!parsedMessage) {
                        // console.warn('[Consumer - Payment] Itens do pedido estão ausentes ou inválidos.');
                        return;
                    }

                    const messageReceived = parsedMessage as IPaymentProcessInCartMelhorEnvio;
                    // chamar melhor envio para processar o pagamento
                    const response = await this.melhorEnvioProvider.paymentToFreight(messageReceived.freightId)
                    
                    if (!response) {
                        throw new AppError('Erro ao processar pagamento');
                    }

                    // atualizar pedido com status "AWAITING_LABEL_GENERATE"
                    await this.orderRepository.updateStatus(messageReceived.orderId, Status.AWAITING_LABEL_GENERATE)

                    console.info('[Consumer - Payment] Pagamento processado com sucesso');
                } catch (error) {
                    console.error('[Consumer ] Erro ao processar mensagem:', error);
                }
            },
        });
    }
    
}

const paymentProcessInCartMelhorEnvio = new PaymentProcessInCartMelhorEnvio();
paymentProcessInCartMelhorEnvio.execute();