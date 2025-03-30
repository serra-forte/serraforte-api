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
import { Address, Box, BoxInProduct, CartItem, Item, PaymentMethod, User } from "@prisma/client";
import { IMailProvider } from '@/providers/MailProvider/interface-mail-provider';
import { IOrderRelationsDTO } from '@/dtos/order-relations.dto';
import { IUserRelations } from '@/dtos/user-relations.dto';
import { IDiscountCouponsRepository } from '@/repositories/interfaces/interface-discount-coupons-repository';
import { MelhorEnvioProvider } from '@/providers/DeliveryProvider/implementations/provider-melhor-envio';
import { IDeliveryRepository } from '@/repositories/interfaces/interface-deliveries-repository';

interface IDeliveryService{
    serviceId: number
    serviceName: string
    shopkeeperId: string
    price: number
    companyName: string
}
interface IITemRelation{
    id: string
    productId: string
    userId: string
    name: string
    price: number,
    mainImage: string
    quantity: number,
    boxes: {
        id: string
        productId: string
        boxId: string
    }[]
}
export interface IFreight{
    userId: string
    freight: number
}
export interface IRequestCreateOrderWithPix {
    userId: string
    remoteIp: string
    freight: {
        id: number
        name: string
        price: number
        company: {
            id: number
            name: string
        }
    }
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
    ) {}

    async execute({
        userId,
        remoteIp,
        address,
        withdrawStore,
        coupons,
        freight
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
        let boxesFromDelivery: Box[] = [];

        // Array para calcular o total de cada lojista e entregador
        let arrayToSplitToMembers: AsaasPaymentWallet[] = [];

        // constate para salvar o id do serviço escolhido no frete da entrega
        let deliveryService: IDeliveryService[] = []

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

                boxesFromDelivery = product.boxes
            }
        }

        // inicialize o valor de desconto
        let discountCoupomValue = 0

        // For para calcular o total de cada lojista
        // buscar lojista pelo id
        const findShopKeeperExist = await this.userRepository.findById(findShoppingCartExist.cartItem[0].userId) as unknown as IUserRelations

        // validar se o lojista existe
        if(!findShopKeeperExist) {
            throw new AppError("Lojista não encontrado", 404)
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
                        let calcDiscount = total * Number(findCoupomExist.discount) / 100

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

                    if(total < minValueToUseCoupon) {
                        throw new AppError(`O pedido deve atintigir o mínimo de R$ ${minValueToUseCoupon}`, 400)
                    }

                    // atualizar quantidade do cupom
                    await this.discountCoupon.decrementQuantity(findCoupomExist.id)

                    // aplicar o calculo de desconto do cupom
                    total = total - discountCoupomValue
                }
            }
            
        }
        deliveryService.push({
            shopkeeperId: findShopKeeperExist.id,
            serviceId: freight.id,
            serviceName: freight.name,
            companyName: freight.company.name,
            price: freight.price
        })

        // adicionar o valor do frete ao total do pedido
        total += freight.price

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
        }) as IAsaasPayment
        
        if (!paymentAsaas) {
            throw new AppError('Error create payment Asaas', 400)
        }

        // criar data para o pedido
        const dateNow = this.dateProvider.addDays(0)

        let countBooking = await this.orderRepository.countOrders()
        let code = `#${countBooking + 1}`
        let stopVerifyCode = false
        // fazer laço para buscar reserva através do code para ve se existe
        // enquanto existir alterar o valor do code e pesquisar novamente
        // só para quando a reserva nao for encontrada pelo code.
        do{
            // buscar reserva pelo code
            const findBookingByCode = await this.orderRepository.findByCode(code)

            // validar se encontrou reserva pelo code
            if (findBookingByCode) {
                countBooking++
                code = `#${countBooking}`
            } else {
                stopVerifyCode = true
            }
        }while(!stopVerifyCode)


        const boxInProduct = boxesFromDelivery as unknown as BoxInProduct[]

        // criar pedido passando lista de itens para criar juntos
        const order = await this.orderRepository.create({
            userId: findUserExist.id,
            code,
            shoppingCartId: findShoppingCartExist.id,
            total,
            withdrawStore,
            // description,
            delivery: {
                create: {
                    address: {
                        create: address ? address as Address : undefined
                    },
                    serviceDelivery:{
                        create:{
                            companyName: freight.company.name,
                            serviceId: freight.id,
                            price: freight.price,
                            serviceName: freight.name
                        }
                    }
                }
            },
            items: {
                createMany: {
                    data: findShoppingCartExist.cartItem.map(item => {
                        return {
                            productId: item.productId,
                            userId: item.userId as string,
                            quantity: item.quantity,
                            name: item.name,
                            price: Number(item.price),
                            mainImage: item.mainImage,
                            height: Number(item.height),
                            width: Number(item.width),
                            length: Number(item.length),
                            weight: Number(item.weight),
                        } 
                    })
                }
            },
            boxes: {
                createMany: {
                    data: boxInProduct.map(box => {
                        return {
                            boxId: box.boxId,
                        }
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

        if(!order) {
            throw new AppError('Error create order', 400)
        }

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
            user: {
                id: order.user.id,
                name: order.user.name,
                email: order.user.email,
                phone: order.user.phone,
                avatar: order.user.avatarUrl,
                shoppingCart: order.shoppingCart
            },
            delivery: {
                address: address ? address : undefined
            },
            boxes: order.boxes,
            payment: order.payment,
            total: Number(order.total), 
            items: order.items,
        } as unknown as IOrderRelationsDTO;
        

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
                order
            }
        )

        // retornar pedido criado
        return endOrder
    }
}