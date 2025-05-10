import { Box, Order, Prisma, Status, User } from "@prisma/client";
import { IFilterOrders, IOrderRepository, IResponseListOrders } from "../interfaces/interface-order-repository";
import { prisma } from "@/lib/prisma";
import { IOrderRelationsDTO } from "@/dtos/order-relations.dto";

export class PrismaOrderRepository implements IOrderRepository {
    async listByAsaasPaymentId(asaasPaymentId: string): Promise<IOrderRelationsDTO[]> {
        const orders = await prisma.order.findMany({
            where: {
                payment: {
                    asaasPaymentId,
                }
            },
            select: {
                id: true,
                withdrawStore: true,
                shoppingCartId: true,
                code: true,
                boxes: {
                    select:{
                        id:true,
                        orderId: true,
                        box: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        cpf: true,
                        phone: true
                    }
                },
                items: true,
                delivery: {
                    select: {
                        id: true,
                        orderId: true,
                        userId: true,
                        deliveryDate: true,
                        shippingDate: true,
                        receiverDocument: true,
                        freights: true,
                        receiverName: true,
                        deliveryMan: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                role: true
                            }
                        },
                        latitude: true,
                        longitude: true,
                        createdAt: true,
                        address: true
                    }
                },
                payment: true,
                total: true,
                status: true,
                createdAt: true
            }
        }) as unknown as IOrderRelationsDTO[]

        return orders
    }
    async confirmWithdrawed(id: string, date: string): Promise<void> {
        await prisma.order.update({
            where: {id},
            data:{
                withdrawStoreDate: date
            }
        })
    }
    async countBySentAndUserId(userId: string): Promise<number> {
        const total = await prisma.order.count({
            where: {
                status: Status.SENT,
                delivery:{
                    userId
                }
            }
        })

        return total
    }
    async filterOrders(filters: IFilterOrders): Promise<IResponseListOrders> {
        let dateFormat = filters.date ? new Date(filters.date).toISOString() : undefined
        let page = filters.page ? filters.page : 1
        const total = filters.total === 'true' ? true : filters.total === 'false' ? false : filters.total;
    
        // Definindo a ordenação de forma condicional
        const orderByConditions: Prisma.OrderOrderByWithRelationInput[] = [];

        if (total === true) {
            orderByConditions.push({ total: 'desc' });
        } else if (total === false) {
            orderByConditions.push({ total: 'asc' });
        } else {
            if(!dateFormat){
                orderByConditions.push({ createdAt: 'desc' });
            }
        }
        
        // Construir o objeto de filtros para o Prisma
        const orders = await prisma.order.findMany({
            orderBy: orderByConditions,
            take: 13,
            skip: (page - 1) * 13,
            where: {
                AND: [
                    filters.code ? { code: filters.code } : {},
                    filters.date ? { createdAt: { gte: dateFormat } } : {},
                    filters.client ? { 
                        user: { 
                            name: { contains: filters.client, mode: 'insensitive' }
                        }
                    } : {},
                    filters.status ? { status: filters.status } : {},
                    filters.paymentStatus ? {
                        payment: {
                            paymentStatus: filters.paymentStatus
                        }
                    } : {},
                ],
            },
            select: {
                id: true,
                withdrawStore: true,
                shoppingCartId: true,
                code: true,
                boxes: {
                    select:{
                        id:true,
                        orderId: true,
                        box: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        cpf: true,
                        phone: true,
                        address: true
                    }
                },
                items: true,
                delivery: {
                    select: {
                        id: true,
                        orderId: true,
                        userId: true,
                        deliveryDate: true,
                        shippingDate: true,
                        receiverDocument: true,
                        freights: true,
                        receiverName: true,
                        deliveryMan: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                role: true
                            }
                        },
                        latitude: true,
                        longitude: true,
                        createdAt: true,
                        address: true
                    }
                },
                payment: true,
                cancellations: true,
                total: true,
                status: true,
                createdAt: true
            }
        }) as unknown as IOrderRelationsDTO[]
    
        const countPage = await prisma.order.count({
            where: {
                AND: [
                    filters.code ? { code: filters.code } : {},
                    filters.date ? { createdAt: { gte: new Date(filters.date).toISOString() } } : {},
                    filters.client ? { 
                        user: { 
                            name: { contains: filters.client, mode: 'insensitive' }
                        }
                    } : {},
                    filters.status ? { status: filters.status } : {},
                    filters.paymentStatus ? {
                        payment: {
                            paymentStatus: filters.paymentStatus
                        }
                    } : {},
                ],
            },
        }); //s
    
        const totalPages = countPage > 0 ? Math.ceil(countPage / 13) : 0;
    
        return { orders, totalPages };
    }
    async listByPaymentWithoutPaying24Hours(){
        return await prisma.order.findMany({
            where: {
                payment:{
                    paymentStatus: Status.PENDING
                },
            },
            select: {
                id: true,
                withdrawStore: true,
                shoppingCartId: true,
                code:true,
                user:{
                    select:{
                        id: true,
                        name: true,
                        email: true,
                        cpf: true,
                        phone: true
                    }
                },
                items: true,
                delivery: {
                    select:{
                        id: true,
                        orderId: true,
                        userId: true,
                        deliveryDate: true,
                        shippingDate: true,
                        receiverDocument: true,
                        freights: true,
                        receiverName: true,
                        deliveryMan: {
                            select:{
                                id: true,
                                name: true,
                                email: true,
                                role: true
                            }
                        },
                        latitude: true,
                        longitude: true,
                        createdAt: true,
                        address: true
                    }
                },
                payment: true,
                total: true,
                status:true,
                createdAt: true
            }
        }) as unknown as IOrderRelationsDTO[]
    }
    async listByShoppKeeper(userId: string, page?: number | null){
        const pageNumber = page ?? 1;
        const orders = await prisma.order.findMany({
            where: {
                items:{
                    some: {
                        userId
                    }
                }
            },
            take: 13,
            skip: (pageNumber - 1) * 13,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                withdrawStore: true,
                shoppingCartId: true,
                code:true,
                user:{
                    select:{
                        id: true,
                        name: true,
                        email: true,
                        cpf: true,
                        phone: true,
                        address: true
                    }
                },
                items: true,
                delivery: {
                    select:{
                        id: true,
                        orderId: true,
                        userId: true,
                        deliveryDate: true,
                        shippingDate: true,
                        receiverDocument: true,
                        freights: true,
                        receiverName: true,
                        deliveryMan: {
                            select:{
                                id: true,
                                name: true,
                                email: true,
                                role: true
                            }
                        },
                        latitude: true,
                        longitude: true,
                        createdAt: true,
                        address: true
                    }
                },
                payment: true,
                total: true,
                status:true,
                createdAt: true
            }
        }) as unknown as IOrderRelationsDTO[]

        // Contar o total de registros
        const countPage = await prisma.order.count({
            where: {
                items: {
                    some: {
                        userId
                    }
                }
            }
        });

        // Calcular o total de páginas
        const totalPages = countPage > 0 ? Math.ceil(countPage / 13) : 0;
        
        return {
            orders,
            totalPages
        }
    }
    async listByDeliveryMan(userId: string, page?: number | null){
        const pageNumber = page ?? 1;
        const orders = await prisma.order.findMany({
            where: {
                delivery:{
                    deliveryMan:{
                        id: userId
                    }
                }
            },
            take: 13,
            skip: (pageNumber - 1) * 13,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                withdrawStore: true,
                shoppingCartId: true,
                code:true,
                user:{
                    select:{
                        id: true,
                        name: true,
                        email: true,
                        cpf: true,
                        phone: true,
                        address: true
                    }
                },
                items: true,
                delivery: {
                    select:{
                        id: true,
                        orderId: true,
                        userId: true,
                        deliveryDate: true,
                        shippingDate: true,
                        receiverDocument: true,
                        freights: true,
                        receiverName: true,
                        deliveryMan: {
                            select:{
                                id: true,
                                name: true,
                                email: true,
                                role: true
                            }
                        },
                        latitude: true,
                        longitude: true,
                        createdAt: true,
                        address: true
                    }
                },
                payment: true,
                total: true,
                status:true,
                createdAt: true
            }
        }) as unknown as IOrderRelationsDTO[]
       
        const countPage = await prisma.order.count({
            where: {
                items: {
                    some: {
                        userId
                    }
                }
            }
        });

        // Calcular o total de páginas
        const totalPages = countPage > 0 ? Math.ceil(countPage / 13) : 0;
        
        return {
            orders,
            totalPages
        }
    }
    async addDescription(id: string, description: string): Promise<void> {
        await prisma.order.update({
            where: {id},
            data: {
                description
            }
        })
    }
    async listByIds(orderIds:string[]){
        const orders = await prisma.order.findMany({
            where: {
                id: {
                    in: orderIds
                }
            },
            select: {
                id: true,
                withdrawStore: true,
                shoppingCartId: true,
                code:true,
                user:{
                    select:{
                        id: true,
                        name: true,
                        email: true,
                        cpf: true,
                        phone: true
                    }
                },
                items: true,
                delivery: {
                    select:{
                        id: true,
                        orderId: true,
                        userId: true,
                        deliveryDate: true,
                        shippingDate: true,
                        receiverDocument: true,
                        freights: true,
                        receiverName: true,
                        deliveryMan: {
                            select:{
                                id: true,
                                name: true,
                                email: true,
                                role: true
                            }
                        },
                        latitude: true,
                        longitude: true,
                        createdAt: true,
                        address: true
                    }
                },
                payment: true,
                total: true,
                status:true,
                createdAt: true
            }
        }) as unknown as Order[]

        return orders
    }
    async countOrders() {
        return prisma.order.count()
    }
    async create(data: Prisma.OrderUncheckedCreateInput){
        const order = await prisma.order.create({
            data,
            select:{
                id: true,
                shoppingCartId: true,
                code:true,
                user:{
                    select:{
                        id: true,
                        name: true,
                        email: true,
                        cpf: true,
                        phone: true
                    }
                },
                items: true,
                boxes: {
                    select:{
                        id:true,
                        orderId: true,
                        box: true
                    }
                },
                delivery: {
                    select:{
                        id: true,
                        orderId: true,
                        userId: true,
                        deliveryDate: true,
                        shippingDate: true,
                        receiverDocument: true,
                        freights: true,
                        receiverName: true,
                        deliveryMan: {
                            select:{
                                id: true,
                                name: true,
                                email: true,
                                role: true
                            }
                        },
                        latitude: true,
                        longitude: true,
                        createdAt: true,
                        address: true
                    }
                },
                payment: true,
                total: true,
                status:true,
                createdAt: true
            }
        }) as unknown as Order

        return order
    }
    async list(page = 1, take = 13) {
        const orders = await prisma.order.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            take,
            skip: (page - 1) * 13,
            select: {
                id: true,
                withdrawStore: true,
                shoppingCartId: true,
                code:true,
                user:{
                    select:{
                        id: true,
                        name: true,
                        email: true,
                        cpf: true,
                        phone: true,
                        address: true
                    }
                },
                items: true,
                boxes: {
                    select:{
                        id:true,
                        orderId: true,
                        box: true
                    }
                },
                delivery: {
                    select:{
                        id: true,
                        orderId: true,
                        userId: true,
                        deliveryDate: true,
                        shippingDate: true,
                        receiverDocument: true,
                        freights: true,
                        receiverName: true,
                        deliveryMan: {
                            select:{
                                id: true,
                                name: true,
                                email: true,
                                role: true
                            }
                        },
                        latitude: true,
                        longitude: true,
                        createdAt: true,
                        address: true
                    }
                },
                payment: true,
                cancellations: true,
                total: true,
                status:true,
                createdAt: true
            }
        }) as unknown as IOrderRelationsDTO[]

        const countPage = await prisma.order.count();


        // Calcular o total de páginas
        const totalPages = countPage > 0 ? Math.ceil(countPage / 13) : 0;
        
        return {
            orders: orders.map(order => {
                const boxFormated = order.boxes as unknown as {
                    box: Box;
                }[];
                return {
                    ...order,
                    total: Number(order.total) + Number(order.delivery.freights.reduce((acc, freight) => acc + Number(freight.price), 0)),
                    boxes: boxFormated.map(box => box.box)
                };
            }),
            totalPages
        } as unknown as IResponseListOrders
        
    }
    async listByUserId(idUser: string, page = 1, take = 13) {
        const orders = await prisma.order.findMany({
            where: {
                userId: idUser
            },
            orderBy: {
                createdAt: 'desc'
            },
            take,
            skip: (page - 1) * take,
            select: {
                id: true,
                withdrawStore: true,
                shoppingCartId: true,
                code:true,
                user:{
                    select:{
                        id: true,
                        name: true,
                        email: true,
                        cpf: true,
                        phone: true,
                        address: true
                    }
                },
                items: true,
                delivery: {
                    select:{
                        id: true,
                        orderId: true,
                        userId: true,
                        deliveryDate: true,
                        shippingDate: true,
                        receiverDocument: true,
                        freights: true,
                        receiverName: true,
                        deliveryMan: {
                            select:{
                                id: true,
                                name: true,
                                email: true,
                                role: true
                            }
                        },
                        latitude: true,
                        longitude: true,
                        createdAt: true,
                        address: true
                    }
                },
                payment: true,
                cancellations: true,
                total: true,
                status:true,
                createdAt: true
            }
        }) as unknown as IOrderRelationsDTO[]

        const countPage = await prisma.order.count({
            where: {
                userId: idUser
            },
        });

        // Calcular o total de páginas
        const totalPages = countPage > 0 ? Math.ceil(countPage / 13) : 0;
        
        return {
            orders: orders.map(order => {
                return{
                    ...order,
                    total: Number(order.total) + Number(order.delivery.freights.reduce((acc, freight) => acc + Number(freight.price), 0))
                }
            }),
            totalPages
        } as unknown as IResponseListOrders
    }
    async findById(id: string){
        const order = await prisma.order.findUnique({
            where: {id},
            select: {
                id: true,
                withdrawStore: true,
                shoppingCartId: true,
                code:true,
                user:{
                    select:{
                        id: true,
                        bierHeldClientId: true,
                        name: true,
                        email: true,
                        cpf: true,
                        phone: true,
                        address: true
                    }
                },
                items: true,
                boxes: {
                    select:{
                        id:true,
                        orderId: true,
                        box: true
                    }
                },
                delivery: {
                    select:{
                        id: true,
                        orderId: true,
                        userId: true,
                        deliveryDate: true,
                        shippingDate: true,
                        receiverDocument: true,
                        freights: true,
                        receiverName: true,
                        serviceDelivery: true,
                        deliveryMan: {
                            select:{
                                id: true,
                                name: true,
                                email: true,
                                role: true
                            }
                        },
                        latitude: true,
                        longitude: true,
                        createdAt: true,
                        address: true
                    }
                },
                payment: true,
                cancellations: true,
                total: true,
                status:true,
                createdAt: true
            }
        }) as unknown as IOrderRelationsDTO
       
        
        return {
            ...order,
            total: Number(order.total) + Number(order.delivery.serviceDelivery.price)
        }
    }
    async findByCode(code: string){
        const order = await prisma.order.findUnique({
            where: {code},
            select: {
                id: true,
                withdrawStore: true,
                shoppingCartId: true,
                code:true,
                user:{
                    select:{
                        id: true,
                        name: true,
                        email: true,
                        cpf: true,
                        phone: true,
                        address: true
                    }
                },
                items: true,
                boxes: {
                    select:{
                        id:true,
                        orderId: true,
                        box: true
                    }
                },
                delivery: {
                    select:{
                        id: true,
                        orderId: true,
                        userId: true,
                        deliveryDate: true,
                        shippingDate: true,
                        receiverDocument: true,
                        freights: true,
                        receiverName: true,
                        deliveryMan: {
                            select:{
                                id: true,
                                name: true,
                                email: true,
                                role: true
                            }
                        },
                        latitude: true,
                        longitude: true,
                        createdAt: true,
                        address: true
                    }
                },
                payment: true,
                cancellations: true,
                total: true,
                status:true,
                createdAt: true
            }
        }) as unknown as Order
        
        return order
    }
    async deleteById(id: string){
        await prisma.order.delete({where: {id}})
    }
    async updateStatus(id: string, status: Status){
        await prisma.order.update({
            where: {id},
            data: {
                status
            }
        })
    }
}