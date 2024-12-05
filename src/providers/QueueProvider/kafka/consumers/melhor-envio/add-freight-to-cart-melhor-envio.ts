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

export class AddFreightToCartMelhorEnvio {
    private kafkaConsumer: KafkaConsumer;
    private railwayProvider: IRailwayProvider;
    private mailProvider: IMailProvider;
    private usersRepository: IUsersRepository;
    private melhorEnvioProvider: IMelhorEnvioProvider;
    private orderRepository: IOrderRepository;

    constructor() {
        this.kafkaConsumer = new KafkaConsumer();
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
        const createdConsumer = await this.kafkaConsumer.execute('add-freight-to-cart');

        createdConsumer.run({
            eachMessage: async ({ message }) => {
                if (!message || !message.value) {
                    console.warn('[Consumer] Mensagem vazia ou inválida:', message);
                    return;
                }

                try {
                    const parsedMessage = JSON.parse(message.value.toString());
                    console.log('[Consumer] Mensagem recebida:', parsedMessage);

                    if (!parsedMessage.items || !Array.isArray(parsedMessage.items) || parsedMessage.items.length === 0) {
                        console.warn('[Consumer] Itens do pedido estão ausentes ou inválidos.');
                        return;
                    }

                    const order = parsedMessage as IOrderRelationsDTO;
                    console.log('[Consumer] Pedido:', order);
                    // Buscar lojista pelo ID do primeiro item
                    const shopkeeper = await this.usersRepository.findById(order.items[0].userId as string) as unknown as IUserRelations;
                    if (!shopkeeper || !shopkeeper.address) {
                        console.error('[Consumer] Lojista não encontrado ou endereço inválido.');
                        return;
                    }
                    console.log('[Shopkeeper Address]', shopkeeper.address);

                    // Buscar cliente pelo ID do pedido
                    const customer = await this.usersRepository.findById(order.user.id as string) as unknown as IUserRelations;
                    if (!customer || !customer.address) {
                        console.error('[Consumer] Cliente não encontrado ou endereço inválido.');
                        return;
                    }
                    console.log('[Customer Address]', customer.address);

                    // Lógica de envio do frete
                    // await this.melhorEnvioProvider.addFreightToCart({
                    //     from: shopkeeper.address,
                    //     to: customer.address,
                    //     weight: order.boxes[0]?.weight || 0,
                    //     agency: "Agência Exemplo",
                    //     service: "Serviço Exemplo",
                    //     products: order.items,
                    //     volumes: order.boxes,
                    // });

                    console.info('[Consumer] Frete adicionado ao carrinho com sucesso.');

                    // Atualizar status do pedido e informações relacionadas
                    await this.orderRepository.updateStatus(order.id, "AWAITING_LABEL_PAYMENT_PROCESS");

                } catch (error) {
                    console.error('[Consumer] Erro ao processar mensagem:', error);
                }
            },
        });
    }
}

const kafkaConsumer = new AddFreightToCartMelhorEnvio();
kafkaConsumer.execute();
