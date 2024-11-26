import { IAsaasPayment } from '@/dtos/asaas-payment.dto';
import { AsaasPaymentWallet, IAsaasProvider } from './../../../../../providers/PaymentProvider/interface-asaas-payment';
import { IShoppingCartRelationsDTO } from "@/dtos/shopping-cart-relations.dto";
import { IDateProvider } from "@/providers/DateProvider/interface-date-provider";
import { ICartItemRepository } from "@/repositories/interfaces/interface-cart-item-repository";
import { IOrderRepository } from "@/repositories/interfaces/interface-order-repository";
import { IProductsRepository, IResponseFindProductWithReviews } from "@/repositories/interfaces/interface-products-repository";
import { IShoppingCartRepository } from "@/repositories/interfaces/interface-shopping-cart-repository";
import { IUsersRepository } from "@/repositories/interfaces/interface-users-repository";
import { AppError } from "@/usecases/errors/app-error";
import { Address, CartItem, Item, PaymentMethod, User } from "@prisma/client";
import { IMailProvider } from '@/providers/MailProvider/interface-mail-provider';
import { IOrderRelationsDTO } from '@/dtos/order-relations.dto';
import { IUserRelations } from '@/dtos/user-relations.dto';
import { IDiscountCouponsRepository } from '@/repositories/interfaces/interface-discount-coupons-repository';
import { MelhorEnvioProvider } from '@/providers/DeliveryProvider/implementations/provider-melhor-envio';
import { IDeliveryRepository } from '@/repositories/interfaces/interface-deliveries-repository';

export interface IFreight{
    userId: string
    freight: number
}
export interface IRequestCreateOrderWithPix {
    userId: string
    remoteIp: string
    freight: string
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
    } | null
}



export class CreateOrderWithPixUsecase {
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
        private melhorEnvioProvider: MelhorEnvioProvider,
        private deliveryRepository: IDeliveryRepository
    ) {}

    async execute({
        userId,
        remoteIp,
        address,
        withdrawStore,
        coupons,
        freight:freightName
    }: IRequestCreateOrderWithPix): Promise<IOrderRelationsDTO> {
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

        // Inicialize um objeto para agrupar os itens por lojista (user.id)
        let objItemsShopKeeper: any = {};

        // Array para calcular o total de cada lojista e entregador
        let arrayToSplitToMembers: AsaasPaymentWallet[] = [];

        let paymentFeeDicount = 0

        // constate para salvar o id do serviço escolhido no frete da entrega
        let deliveryServiceId = 0

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
        let arrayItemsShopKeeperArray: CartItem[][] = Object.values(objItemsShopKeeper);

        let valuesToFreightPerShopkeeper: IFreight[] = []

        // inicialize o valor de desconto
        let discountCoupomValue = 0

        // For para calcular o total de cada lojista
        for(let arrayShopKeeper of arrayItemsShopKeeperArray) {
            // buscar lojista pelo id
            const findShopKeeperExist = await this.userRepository.findById(arrayShopKeeper[0].userId as string) as unknown as IUserRelations

            // validar se o lojista existe
            if(!findShopKeeperExist) {
                throw new AppError("Lojista não encontrado", 404)
            }

            let totalShopKeeper = arrayShopKeeper.reduce((acc, item) => {
                let total = acc + Number(item.price) * Number(item.quantity);
                return total;
            }, 0);
            
            totalShopKeeper = totalShopKeeper * Number(findShopKeeperExist.paymentFee) / 100;
            
            // validar se o lojista tem um asaasWalletId
            if(!findShopKeeperExist.asaasWalletId) {
                throw new AppError("Lojista não possui carteira de pagamento Asaas", 404)
            }

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
                    }
                }
                
            }

            // aplicar calculo de desconto no total menos o desconto para cada lojista
            totalShopKeeper = totalShopKeeper - paymentFeeDicount

            // adicionar total de cada lojista no arrayPaymentWalletToShopKeeper
            arrayToSplitToMembers.push({
                userId: findShopKeeperExist.id,
                walletId: findShopKeeperExist.asaasWalletId,
                fixedValue: totalShopKeeper
            })

            // chamar melhor envio e enviar as dimentonses do produto para calcular o frete
            const response = await this.melhorEnvioProvider.shipmentCalculate({
            to: {
                postal_code: findUserExist.address.zipCode as string
            },
            from:{
                postal_code: findShopKeeperExist.address.zipCode as string
            },
            products: arrayShopKeeper.map(item => {
                return {
                    height: Number(item.height),
                    width: Number(item.width),
                    length: Number(item.length),
                    weight: Number(item.weight),
                    quantity: Number(item.quantity),
                    id: item.id,
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

        deliveryServiceId = freightService.id

        // adicionar o valor do frete ao total do pedido
        total += freightValue

        valuesToFreightPerShopkeeper.push({
            userId: findShopKeeperExist.id,
            freight: freightValue
        })
    }

        // calcular cupom de desconto
        // criar pagamento na asaas
        let newCustomer = ''
        const newDate = this.dateProvider.addDays(0)
        // validar se o cliente existe no asaas se não existir criar            // atualizar user com o id do cliente no asaas
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

        // verificar se o usuario tem um idCostumerPayment se não tiver retorna o new customer criado anteriormente
        const idCostumerPayment = String(newCustomer)

        // criar cobrança do tipo pix no asaas
        const paymentAsaas = await this.asaasProvider.createPayment({
            customer: idCostumerPayment,
            billingType: PaymentMethod.PIX,
            dueDate: newDate,
            value: total,
            description: 'Payment of order',
            remoteIp: String(remoteIp),
            split: arrayToSplitToMembers.map(split =>{
                return{
                    fixedValue: split.fixedValue,
                    walletId: split.walletId
                } as AsaasPaymentWallet
            }) ?? null
        }) as IAsaasPayment
        
        if (!paymentAsaas) {
            throw new AppError('Error create payment Asaas', 400)
        }

        // array de id do pedidos para retornar
        let createdOrders: IOrderRelationsDTO[] = [];

        // criar data para o pedido
        const dateNow = this.dateProvider.addDays(0)

        // Função para criar pedidos recursivamente
        async function recursiveCreateOrders(
            arrayShopKeeper: CartItem[][], 
            orderRepository: IOrderRepository, 
            valuesToFreightPerShopkeeper: IFreight[],
            index = 0,) {
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
                userId: findUserExist.id,
                code,
                shoppingCartId: findShoppingCartExist.id,
                total,
                withdrawStore,
                // description,
                delivery: {
                    create: {
                        serviceId: deliveryServiceId,
                        deliveryDate: dateNow,
                        price: valuesToFreightPerShopkeeper.find(item => item.userId === itemsShopKeeper[0].userId)?.freight,
                        address: {
                            create: address ? address as Address : undefined
                        }
                    }
                },
                items: {
                    createMany: {
                        data: itemsShopKeeper.map(item => {
                            return {
                                productId: item.productId,
                                userId: item.userId as string,
                                quantity: item.quantity,
                                name: item.name,
                                price: Number(item.price),
                                mainImage: item.mainImage,
                            } as unknown as Item;
                        })
                    }
                },
                payment: {
                    create: {
                        asaasPaymentId: paymentAsaas.id,
                        userId: findUserExist.id,
                        paymentMethod: "PIX",
                        invoiceUrl: paymentAsaas.invoiceUrl,
                        value: total,
                        discount: discountCoupomValue,
                    }
                },
                createdAt: dateNow
            }) as unknown as IOrderRelationsDTO

                // adicionar id do pedido ao array
                createdOrders.push(order)

                // mandar email para lojista que o pedido foi criado
            } catch (error) {
                console.log(error)
                throw new AppError("Erro ao criar pedido", 400)
            }

            // Chama a função recursiva para o próximo grupo de itens
            await recursiveCreateOrders(arrayShopKeeper, orderRepository, valuesToFreightPerShopkeeper, index + 1);
        }

        await recursiveCreateOrders(arrayItemsShopKeeperArray, this.orderRepository, valuesToFreightPerShopkeeper);

        // decrementar quantidade no estoque
        for(let item of findShoppingCartExist.cartItem) {
            await this.productsRepository.decrementQuantity(item.productId, item.quantity)

            const response = await this.productsRepository.findById(item.productId) as IResponseFindProductWithReviews

            const {
                product
            } = response

            // atualizar vendas do produto no estoque
            await this.productsRepository.updateSales(item.productId, item.quantity)

            // atualizar vendas do produto no estoque
            await this.productsRepository.updateSales(item.productId, item.quantity)

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
            endOrder.total += valuesToFreightPerShopkeeper.reduce((total, item) => total + Number(item.freight), 0);
        }

       

        // criar variavel com caminho do template de email
        const templatePathApproved = './views/emails/confirmation-payment.hbs'

        // disparar envio de email de pagamento recebido do usuário com nota fiscal(invoice)
        await this.mailProvider.sendEmail(
            findUserExist.email,
            findUserExist.name,
            'Confirmação de Pagamento',
            paymentAsaas.invoiceUrl,
            templatePathApproved,
            {
                order: endOrder
            }
        )

        // retornar pedido criado
        return endOrder
    }
}