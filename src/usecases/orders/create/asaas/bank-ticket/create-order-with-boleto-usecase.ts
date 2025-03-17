import { IAsaasPayment } from '@/dtos/asaas-payment.dto';
import { AsaasPaymentWallet, IAsaasProvider } from '../../../../../providers/PaymentProvider/interface-asaas-payment';
import { IShoppingCartRelationsDTO } from "@/dtos/shopping-cart-relations.dto";
import { IDateProvider } from "@/providers/DateProvider/interface-date-provider";
import { ICartItemRepository } from "@/repositories/interfaces/interface-cart-item-repository";
import { IOrderRepository } from "@/repositories/interfaces/interface-order-repository";
import { IProductsRepository, IResponseFindProductWithReviews } from "@/repositories/interfaces/interface-products-repository";
import { IShoppingCartRepository } from "@/repositories/interfaces/interface-shopping-cart-repository";
import { IUsersRepository } from "@/repositories/interfaces/interface-users-repository";
import { AppError } from "@/usecases/errors/app-error";
import { Address, Item, Order, PaymentMethod, User } from "@prisma/client";
import { IMailProvider } from '@/providers/MailProvider/interface-mail-provider';
import { IUserRelations } from '@/dtos/user-relations.dto';
import { IProductRelationsDTO } from '@/dtos/product-relations.dto';
import { IOrderRelationsDTO } from '@/dtos/order-relations.dto';
import { IDiscountCouponsRepository } from '@/repositories/interfaces/interface-discount-coupons-repository';
import { MelhorEnvioProvider } from '@/providers/DeliveryProvider/implementations/provider-melhor-envio';

export interface IRequestCreateOrderWithBoleto {
    userId: string
    freight: {
        id: number
        name: string
        price: number
        company: {
            id: number
            name: string
        }
    }
    remoteIp: string
    withdrawStore: boolean
    coupons?: {
        code?: string | null
    }[] | null
    address?: {
        street?: string | null
        num?: number | null
        neighborhood?: string | null
        city?: string | null
        state?: string | null
        country?: string | null
        zipCode?: string | null
        complement?: string | null
        reference?: string | null
    }  | null
}

export class CreateOrderWithBoletoUsecase {
    constructor(
        private orderRepository: IOrderRepository,
        private userRepository: IUsersRepository,
        private shoppingCartRepository: IShoppingCartRepository,
        private cartItemRepository: ICartItemRepository,
        private productsRepository: IProductsRepository,
        private dateProvider: IDateProvider,
        private asaasProvider: IAsaasProvider,
        private mailProvider: IMailProvider,
        private discountCoupon: IDiscountCouponsRepository,
        private melhorEnvioProvider: MelhorEnvioProvider
    ) {}

    async execute({
        userId,
        remoteIp,
        address,
        coupons,
        withdrawStore,
        freight
    }: IRequestCreateOrderWithBoleto): Promise<IOrderRelationsDTO> {
        // buscar usuario pelo id
        const findUserExist = await this.userRepository.findById(userId) as unknown as IUserRelations

        // validar ser o usuario existe
        if(!findUserExist) {
            throw new AppError("Usuário não encontrado", 404)
        }

        // buscar carrinho pelo id 
        const findShoppingCartExist = await this.shoppingCartRepository.findById(findUserExist.shoppingCart.id) as unknown as IShoppingCartRelationsDTO

        // validar se o carrinho existe
        if(!findShoppingCartExist) {
            throw new AppError("Carrinho não encontrado", 404)
        }

        // calcular total do carrinho
        let total = findShoppingCartExist.cartItem.reduce((acc, cartItem) => {
            return acc + Number(cartItem.price) * Number(cartItem.quantity);
        }, 0);

        if(findShoppingCartExist.cartItem.length === 0) {
            throw new AppError("Carrinho vazio", 400)
        }

        let objItemsShopKeeper: any = {};

        // Array para calcular o total de cada lojista
        let arrayToSplitToMembers: AsaasPaymentWallet[] = [];

        // inicialize o valor do desconto
        let discountCoupomValue = 0

        let paymentFeeDicount = 0

        // verificar a quantidade dos produtos no estoque
        for(let item of findShoppingCartExist.cartItem) {
            const response = await this.productsRepository.findById(item.productId) as IResponseFindProductWithReviews

            const {
                product
            } = response


            if (product) {
                if (product.quantity < item.quantity) {
                    throw new AppError("Estoque insuficiente", 400);
                }

                // Separar items por lojista
                const shopKeeperId = item.userId;
                if (!objItemsShopKeeper[shopKeeperId]) {
                    // Inicializa um array para este lojista se ainda não existe
                    objItemsShopKeeper[shopKeeperId] = [];
                }
                // Adiciona o item ao array correspondente ao lojista
                objItemsShopKeeper[shopKeeperId].push(item);
            }
        }

        // Converte o objeto em um array de arrays
        let arrayItemsShopKeeperArray: IProductRelationsDTO[][] = Object.values(objItemsShopKeeper);

         // buscar entregador existente
         const listDeliveryMan = await this.userRepository.listByDeliveryMan(1, 1)

         // validar se o entregador existe
         const uniqueDeliveryMan = listDeliveryMan.users[0] as User
        
         // variavel para validar que exite entregador
         let existDeliveryMan = false
 
         if(address &&
           address.zipCode &&
           address.city &&
           address.state &&
           address.street &&
           address.neighborhood &&
           address.num &&
           address.country
         ){
             const paymentFeeDeliveryMan = Number(uniqueDeliveryMan.paymentFee)
             
             total = total + paymentFeeDeliveryMan

             existDeliveryMan = true

             existDeliveryMan = true
 
             arrayToSplitToMembers.push({
                 userId: uniqueDeliveryMan.id,
                 walletId: uniqueDeliveryMan.asaasWalletId as string,
                 fixedValue: paymentFeeDeliveryMan
             })
         }
        
        // For para calcular o total de cada lojista
        for(let arrayShopKeeper of arrayItemsShopKeeperArray) {
            // buscar lojista pelo id
            const findShopKeeperExist = await this.userRepository.findById(arrayShopKeeper[0].user.id as string) as unknown as IUserRelations

            // validar se o lojista existe
            if(!findShopKeeperExist) {
                throw new AppError("Lojista não encontrado", 404)
            }

            // validar se o lojista tem um asaasWalletId
            if(!findShopKeeperExist.asaasWalletId) {
                throw new AppError("Lojista não possui carteira de pagamento Asaas", 404)
            }

            let totalShopKeeper = arrayShopKeeper.reduce((acc, item) => {
                let total = acc + Number(item.price) * Number(item.quantity);
                return total;
            }, 0);
            
            totalShopKeeper = totalShopKeeper * Number(findShopKeeperExist.paymentFee) / 100;

            paymentFeeDicount = totalShopKeeper * Number(findShopKeeperExist.paymentFee) / 100

            if(coupons && coupons.length > 0) {
                    // filtrar cupom de desconto pelo id do lojista no array de cupons
                    for(let coupom of coupons) {
                        // buscar cupom de desconto pelo
                        const findCoupomExist = await this.discountCoupon.findByCode(coupom.code as string)

                        // verificar cupom de desconto
                        if(!findCoupomExist) {
                            throw new AppError("Cupom de desconto não encontrado", 404)
                        }

                        // validar quantidade de cupons
                        if(findCoupomExist.quantity === 0) {
                            throw new AppError("Quantidade de cupons esgotada", 404)
                        }

                        // verifica se o id do user no cupom é igual ao id do lojista
                        if(findCoupomExist.userId === findShopKeeperExist.id) {
                            // verificar tipo de desconto
                            if(findCoupomExist.type === "PERCENTAGE") {
                                // calcular total do desconto do cupom
                                let calcDiscount = totalShopKeeper * Number(findCoupomExist.discount) / 100

                                // passa o calculo do desconto para a variavel discountCupomValue
                                discountCoupomValue = calcDiscount
                            }

                            if(findCoupomExist.type === "FIXED") {
                                // calcular total do desconto do cupom
                                let calcDiscount = Number(findCoupomExist.discount)

                                // passa o calculo do desconto para a variavel discountCupomValue
                                discountCoupomValue = calcDiscount
                            }

                            let minValueToUseCoupon = Number(findCoupomExist.minValue)

                            if(totalShopKeeper < minValueToUseCoupon) {
                                throw new AppError(`O pedido deve atintigir o mínimo de R$ ${minValueToUseCoupon}`, 400)
                            }

                            // atualizar quantidade do cupom
                            await this.discountCoupon.decrementQuantity(findCoupomExist.id)
                    
                            // aplicar o calculo de desconto do cupom
                            totalShopKeeper = totalShopKeeper - discountCoupomValue

                            // aplicar desconto do cupom no total se existir
                            total = total - discountCoupomValue
                            
                        }
                    }
                
            }
            
            // aplicar calculo de desconto no total menos o desconto para cada lojista
            totalShopKeeper = totalShopKeeper - paymentFeeDicount

            // adicionar total de cada lojista no arrayToSplitToMembers
            arrayToSplitToMembers.push({
                userId: findShopKeeperExist.id,
                walletId: findShopKeeperExist.asaasWalletId,
                fixedValue: totalShopKeeper
            })

            // chamar melhor envio e enviar as dimentonses do produto para calcular o frete
            const response = await this.melhorEnvioProvider.shipmentCalculate({
                to: {
                    postal_code: findShopKeeperExist.address.zipCode as string
                },
                from:{
                    postal_code: findShopKeeperExist.address.zipCode as string
                },
                products: arrayShopKeeper.map(product => {
                    return {
                        height: Number(product.height),
                        width: Number(product.width),
                        length: Number(product.length),
                        weight: Number(product.weight),
                        quantity: Number(product.quantity),
                        id: product.id,
                        insurance_value: 0,
                    }
                })
            })
            
            // buscar frete pelo nome dentro do response da melhor envio
            const freightService = response.find(freightService => freightService.name === freightName)
            
            // validar se o frete foi encontrado
            if(!freightService) {
                throw new AppError("Frete não encontrado", 404)
            }

            // converter o valor do frete para number
            const freightValue = Number(freightService.price)

            // adicionar o valor do frete ao total do pedido
            total += freightValue

        }

        // criar pagamento na asaas
        let newCustomer = findUserExist.asaasCustomerId

        const newDate = this.dateProvider.addDays(0)
        // validar se o cliente existe no asaas se não existir criar            // atualizar user com o id do cliente no asaas
        if(!newCustomer) {
            const createCustomer = await this.asaasProvider.createCustomer({
                name: findUserExist.name,
                cpfCnpj: findUserExist.cpf as string,
                email: findUserExist.email,
                phone: findUserExist.phone?.replace('(+)', '').replace(' ', '') as string,
            })
    
            if (!createCustomer) {
                throw new AppError('Error create customer for Asaas', 400)
            }
    
            const customer = await this.userRepository.updateAsaasCostumerId(
                findUserExist.id,
                createCustomer.id as string,
            )
            newCustomer = String(customer.asaasCustomerId)
        }

        // verificar se o usuario tem um idCostumerPayment se não tiver retorna o new customer criado anteriormente
        const idCostumerPayment = String(newCustomer) 

        // criar cobrança do tipo pix no asaas
        const paymentAsaas = await this.asaasProvider.createPayment({
            customer: idCostumerPayment,
            billingType: PaymentMethod.BOLETO,
            dueDate: newDate,
            installmentCount: 1,
            installmentValue: total,
            value: total,
            description: 'Payment of order',
            remoteIp: String(remoteIp),
            split: arrayToSplitToMembers ?? null
        }) as IAsaasPayment
        
        if (!paymentAsaas) {
            throw new AppError('Error create payment Asaas', 400)
        }

        // array de id do pedidos para retornar
        let createdOrders: IOrderRelationsDTO[] = [];

        // criar data para o pedido
        const dateNow = this.dateProvider.addDays(0)

        async function recursiveCreateOrders(arrayShopKeeper: IProductRelationsDTO[][], orderRepository: IOrderRepository, index = 0,) {
            if (index >= arrayShopKeeper.length) {
                return; // Termina a recursão quando todos os pedidos forem criados
            }

            const itemsShopKeeper = arrayShopKeeper[index];
            let countBooking = await orderRepository.countOrders()
            let code = `#${countBooking + 1}`
            let stopVerifyCode = false

            try {
                // fazer laço para buscar reserva através do code para ve se existe
                // enquanto existir alterar o valor do code e pesquisar novamente
                // só para quando a reserva nao for encontrada pelo code.
                do{
                    // buscar reserva pelo code
                    const findBookingByCode = await orderRepository.findByCode(code)
        
                    // validar se encontrou reserva pelo code
                    if (findBookingByCode) {
                        countBooking++
                        code = `#${countBooking}`
                    } else {
                        stopVerifyCode = true
                    }
                }while(!stopVerifyCode)
            
            // somar total do carrinho
            total = itemsShopKeeper.reduce((total, item) => total + Number(item.price) * Number(item.quantity), 0)
                
            // criar pedido passando lista de itens para criar juntos
                const order = await orderRepository.create({
                    userId,
                    code,
                    shoppingCartId: findShoppingCartExist.id,
                    total,
                    withdrawStore,
                    delivery:{
                        create:{
                            address:{
                                create: address ? address as Address : undefined
                            }
                        }
                    },
                    items: {
                        createMany: {
                            data: itemsShopKeeper.map(product => {
                                return {
                                    productId: product.id,
                                    userId: product.user.id as string,
                                    quantity: product.quantity,
                                    name: product.name,
                                    price: Number(product.price),
                                    mainImage: product.mainImage,
                                } as unknown as Item;
                            })
                        }
                    },
                    payment: {
                        create: {
                            asaasPaymentId: paymentAsaas.id,
                            userId,
                            paymentMethod: "BOLETO",
                            invoiceUrl: paymentAsaas.invoiceUrl,
                            value: total,
                            discount: discountCoupomValue
                        }
                    },
                    createdAt: dateNow
                })as unknown as IOrderRelationsDTO

                // adicionar id do pedido ao array
                createdOrders.push(order)
                // mandar email para lojista que o pedido foi criado
            } catch (error) {
                console.error(`Erro ao criar pedido: ${error}`);
                throw new AppError('Erro ao criar pedido', 400);
            }

            // Chama a função recursiva para o próximo grupo de itens
            await recursiveCreateOrders(arrayShopKeeper, orderRepository, index + 1,);
        }

        await recursiveCreateOrders(arrayItemsShopKeeperArray, this.orderRepository);


         // decrementar quantidade no estoque
         for(let item of findShoppingCartExist.cartItem) {
            await this.productsRepository.decrementQuantity(item.productId, item.quantity)

            // atualizar vendas do produto no estoque
            await this.productsRepository.updateSales(item.productId, item.quantity)

            // buscar produto pelo id
            const response = await this.productsRepository.findById(item.productId) as IResponseFindProductWithReviews

            const {
                product
            } = response

            if(product && product.quantity === 0) {
                // desativar produto
                await this.productsRepository.updateStatus(product.id, false)
            }
        }

        // esvaziar o carrinho
        await this.cartItemRepository.deleteAllByShoppingCartId(findShoppingCartExist.id)

        // limpar total
        await this.shoppingCartRepository.updateTotal(findShoppingCartExist.id, 0)

        const endOrder: IOrderRelationsDTO = {
            user: findUserExist,
            delivery: {
                address: address ? address : undefined
            },
            payment: createdOrders[0].payment,
            total: 0, // Inicializa total como 0
            items: [] // Inicializa items como array vazio
        } as unknown as IOrderRelationsDTO;
        
        for (let order of createdOrders) {
            let total = Number(order.total);  // Certifica que 'total' é um número
            endOrder.total += total;          // Acumula o total
            endOrder.items.push(...order.items); // spreed no array de items para acumular os items anteriores e os novos
        }

        if(existDeliveryMan){
            endOrder.total += Number(uniqueDeliveryMan.paymentFee)
        }

       // retornar pedido criado
       return endOrder
    }
}