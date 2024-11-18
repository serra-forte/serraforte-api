import { INodeCronProvider } from "../node-cron.interface";
import { IDateProvider } from "@/providers/DateProvider/interface-date-provider";
import cron from 'node-cron';
import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs";
import { IMailProvider } from "@/providers/MailProvider/interface-mail-provider";
import { MailProvider } from "@/providers/MailProvider/implementations/provider-sendgrid";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { PrismaPaymentRepository } from "@/repositories/prisma/prisma-payments-repository";
import moment from "moment-timezone";
import { IUsersRepository } from "@/repositories/interfaces/interface-users-repository";
import { IPaymentsRepository } from "@/repositories/interfaces/interface-payments-repository";
import { IOrderRepository } from "@/repositories/interfaces/interface-order-repository";
import { PrismaOrderRepository } from "@/repositories/prisma/prisma-orders-repository";
import { IProductsRepository } from "@/repositories/interfaces/interface-products-repository";
import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";
import { Status, User } from "@prisma/client";
import { AsaasProvider } from "@/providers/PaymentProvider/implementations/provider-asaas-payment";
import { IAsaasProvider } from "@/providers/PaymentProvider/interface-asaas-payment";
import { IOrderRelationsDTO } from "@/dtos/order-relations.dto";
import { IMelhorEnvioProvider } from "@/providers/DeliveryProvider/interface-melhor-envio-provider";
import { MelhorEnvioProvider } from "@/providers/DeliveryProvider/implementations/provider-melhor-envio";
import { IRailwayProvider } from "@/providers/RailwayProvider/interface-railway-provider";
import { RailwayProvider } from "@/providers/RailwayProvider/implementations/provider-railway";

export interface IBoxPriceRange{
    startRange: number
    endRange: number
    regularPrice: number
    sazonalPrice: number
}


moment.tz.setDefault('America/Sao_Paulo');
export class NodeCronProvider implements INodeCronProvider {
    dayjsProvider: IDateProvider
    mailProvider: IMailProvider
    userRepository: IUsersRepository
    paymentRepository: IPaymentsRepository
    orderRepository: IOrderRepository
    productRepository: IProductsRepository
    asaasProvider: IAsaasProvider
    railwayProvider: IRailwayProvider
    melhorEnvio: IMelhorEnvioProvider

    constructor(
    ) {
        this.dayjsProvider = new DayjsDateProvider();
        this.mailProvider = new MailProvider();
        this.userRepository = new PrismaUsersRepository();
        this.paymentRepository = new PrismaPaymentRepository();
        this.orderRepository = new PrismaOrderRepository();
        this.productRepository = new PrismaProductsRepository();
        this.asaasProvider = new AsaasProvider();
        this.railwayProvider = new RailwayProvider();
        this.melhorEnvio = new MelhorEnvioProvider(
            this.railwayProvider
        );

    }
    async printingLabelGenerate(): Promise<void> {
        // Agendar a tarefa cron para ser executada a cada minuto
        // (minuto, hora, dia do mês, mês e dia da semana)
        // cron.schedule('* /30 * * *', async () => {
        cron.schedule('* * * * *', async () => {
            try {
                console.log('Gerar etiquetas para impressão.. . .');
                // buscar pedidos com status "AWAITING_LABEL_GENERATE"

                // se existir pedidos com o status "AWAITING_LABEL_GENERATE" gerar etiquetas no Melhor Envio

                // apos gerar estiqueta, também gera o link de impressão na Melhor Envio

                // alterar pedido passando a url de impressão gerada apos gerar etiqueta e o link

                // alterar status do pedido para "LABEL_GENERATED"
            } catch (error) {
                console.error('Erro ao verificar reservas:', error);
            }
        });
    }

    async labelPaymentProcess(): Promise<void> {
        // Agendar a tarefa cron para ser executada a cada minuto
        // (minuto, hora, dia do mês, mês e dia da semana)
        // cron.schedule('* /25 * * *', async () => {
        cron.schedule('* * * * *', async () => {
            try {
                console.log('Processar pagamento das etiquetas.. . .');
                // buscar pedidos com status "AWAITING_LABEL_PAYMENT_PROCESS"

                // se existir pedidos com o status "AWAITING_LABEL_PAYMENT_PROCESS" processar pagamento no Melhor Envio

                    // gerar pagamento no Melhor Envio coms os itens no carrinho com os ids do cartLabelId

                    // alterar status dos pedidos para "AWAITING_LABEL_GENERATED" se o pagamento for realizado,

                        // alterar pedido com o id do cartLabelId no banco
                    
                    // senão enviar notificação para o ADMIN para inserir valor no painel do Melhor Envio
            } catch (error) {
                
                console.error('Erro ao verificar reservas:', error);
            }
        });
    }

    async sendLabelToCart(): Promise<void> {
        // Agendar a tarefa cron para ser executada a cada minuto
        // (minuto, hora, dia do mês, mês e dia da semana)
        // cron.schedule('* /20 * * *', async () => {
        cron.schedule('* * * * *', async () => {
            try {
                console.log('Checkando pedidos para gerar etiquetas.. . .');
                // buscar pedidos com status "AWAITING_LABEL" com status do pagamento "APPROVED"

                // criar laço para percorrer cada pedido para pegar medidas dos volumes

                    // enviar frete para o carrinho na melhor envio

                    // atualizar status do pedido para "AWAITING_LABEL_PAYMENT_PROCESS"

                    // atualizar pedido com id da etiqueta no banco
               
            } catch (error) {
                console.error('Erro ao verificar reservas:', error);
            }
        });
    }

    async checkPaymentAfter24Hours() {
        // Agendar a tarefa cron para ser executada a cada minuto
        // (minuto, hora, dia do mês, mês e dia da semana)
        cron.schedule('0 0 * * *', async () => {
            try {
                console.log('Checkando pedidos sem pagamento a 24 horas.. . .');
               
                // buscar pedidos sem pagamento a 24 horas
                const orders = await this.orderRepository.listByPaymentWithoutPaying24Hours();

                // buscar entregador existente
                const listDeliveryMan = await this.userRepository.listByDeliveryMan(1, 1)

                // [x] buscar todos os usuarios administradores
                const listUsersAdmin = await this.userRepository.listAdmins()

                // validar se o entregador existe
                const uniqueDeliveryMan = listDeliveryMan.users[0] as User
                
                // for para percorrer os pedidos
                for(let order of orders){
                    // criar data limite em utc para comparar com a data de criação do pedido
                    const getLimitDateToPayment = this.dayjsProvider.getLimitToPayment(order.createdAt)
                            
                    // validar se a data de criação ultrapassou a data limite de pagamento
                    const checkLimitDateToCancel = this.dayjsProvider.compareIfAfter(order.createdAt, getLimitDateToPayment)

                    // validar se a data de criação ultrapassou a data limite de pagamento
                    if(checkLimitDateToCancel){
                         // for para percorrer os itens de cada pedido
                        for(let item of order.items){
                            const endOrder: IOrderRelationsDTO = {
                                user: order.user,
                                delivery: {
                                    address: order.delivery.address ? order.delivery.address : undefined
                                },
                                payment: orders[0].payment,
                                total: 0, // Inicializa total como 0
                                items: [] // Inicializa items como array vazio
                              } as unknown as IOrderRelationsDTO;

                            let existDeliveryMan = false
                            let listShopkeeper = []
                            let total = Number(order.total);  // Certifica que 'total' é um número
                            endOrder.total += total;          // Acumula o total
                            endOrder.items.push(...order.items); // spreed no array de items para acumular os items anteriores e os novos
                    
                            // pegar shopkeepers pelo item do pedido
                            const findShopkeeper = await this.userRepository.findById(order.items[0].userId as string)

                            // validar se o shopkeeper existe
                            if(findShopkeeper){
                                listShopkeeper.push(findShopkeeper)
                            }

                            if(!order.withdrawStore){
                                existDeliveryMan = true
                            }
                            
                            if(existDeliveryMan){
                                endOrder.total += Number(uniqueDeliveryMan.paymentFee)
                            }

                            const quantity = Number(item.quantity)

                            // atualizar estoque com a quantidade de itens selecionado pelo usuário
                            this.productRepository.incrementQuantity(item.productId, quantity);

                            // atualizar o status do pedido para expirado
                            await this.orderRepository.updateStatus(order.id, Status.EXPIRED);

                            // atualizar o status do pagamento para expirado
                            await this.paymentRepository.updateStatus(order.payment.id, Status.EXPIRED);

                            // cancelar fatura na asaas
                            await this.asaasProvider.cancelPayment(order.payment.asaasPaymentId as string)

                            // [x] adicioanr descrição no pedido para informar que o pagamento foi reprovado
                            await this.orderRepository.addDescription(order.id, 'Reprovado por falta de pagamento') 


                            // [x] criar variavel com caminho do templeate de email de pagamento reprovado
                            const templatePathUserReproved =
                            './views/emails/admin-payment-reproved.hbs'

                            // [x] disparar envio de email de pagamento recebido do usuário com nota fiscal(invoice)
                            await this.mailProvider.sendEmail(
                                order.user.email,
                                order.user.name,
                                'Pagamento Expirado',
                                order.payment.invoiceUrl,
                                templatePathUserReproved,
                                {
                                order: endOrder,
                                },
                            )


                            // ENVIAR EMAIL PARA ADMIN DO SISTEMA AVISANDO QUE O PAGAMENTO FOI REPROVADO
                            // [x] for para buscar users administradores e enviar email de pagamento reprovado
                            for (const admin of listUsersAdmin) {
                                await this.mailProvider.sendEmail(
                                admin.email,
                                admin.name,
                                `Pagamento Expirado`,
                                order.payment.invoiceUrl,
                                templatePathUserReproved,
                                {
                                    order: endOrder,
                                },
                                )
                            }

                            // [x] for para buscar users Lojistas e enviar email de pagamento aprovado
                            for (const shopkeeper of listShopkeeper) {
                                await this.mailProvider.sendEmail(
                                shopkeeper.email,
                                shopkeeper.name,
                                `Pagamento Aprovado`,
                                order.payment.invoiceUrl,
                                templatePathUserReproved,
                                {
                                    order: endOrder,
                                },
                                )
                            }
         
                        }
                    }
                }
               
            } catch (error) {
                console.error('Erro ao verificar reservas:', error);
            }
        });
    }
}