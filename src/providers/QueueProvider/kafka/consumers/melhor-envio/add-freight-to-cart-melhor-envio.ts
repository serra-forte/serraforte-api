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
    private kafkaConsumer: KafkaConsumer
    private railwayProvider: IRailwayProvider
    private mailProvider: IMailProvider
    private usersRepository: IUsersRepository
    private melhorEnvioProvider: IMelhorEnvioProvider
    private orderRepository: IOrderRepository

    constructor() {
        this.kafkaConsumer = new KafkaConsumer()
        this.railwayProvider = new RailwayProvider()
        this.mailProvider = new MailProvider()
        this.usersRepository = new PrismaUsersRepository()
        this.melhorEnvioProvider = new MelhorEnvioProvider(
            this.railwayProvider,
            this.mailProvider,
            this.usersRepository
        )
        this.orderRepository = new PrismaOrderRepository()
    }
    async execute() {
        const createdConsumer = await this.kafkaConsumer.execute('add-freight-to-cart')

        createdConsumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                // converter a mensagem para JSON
                if(message.value) {
                    const order = JSON.parse(message.value.toString()) as IOrderRelationsDTO

                    console.log(order.items)

                    // buscar lojista pelo id no item do pedido
                    const shopkeeper = await this.usersRepository.findById(order.items[0].userId as string) as unknown as IUserRelations
                    console.log(shopkeeper.address)

                    // buscar usuário do pedido
                    const customer = await this.usersRepository.findById(order.user.id as string) as unknown as IUserRelations
                    console.log(customer.address)
                    

                    // enviar frete para o carrinho na melhor envio
                    // await this.melhorEnvioProvider.addFreightToCart({
                    //     from: data.from,
                    //     to: data.to,
                    //     weight: data.weight,
                    //     agency: data.agency,
                    //     service: data.service,
                    //     products: data.products,
                    //     volumes: data.volumes
                    // })

                    // atualizar status do pedido para "AWAITING_LABEL_PAYMENT_PROCESS"

                    // atualizar pedido com id da etiqueta no banco
                }
                
                
            }
        })
    }
}

const kafkaConsumer = new AddFreightToCartMelhorEnvio()
kafkaConsumer.execute()