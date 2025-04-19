import { prisma } from '../../lib/prisma';
import { Prisma, Status } from '@prisma/client';
import { ICancellationRepository } from './../interfaces/interface-cancellations-repository';
import { ICancellationRelationsDTO } from '../../dtos/cancellation-relations.dto';
import { ICancellationMessageRelationsDTO } from '@/dtos/cancellation-message-relations';
export class PrismaCancellationRepository implements ICancellationRepository{
    async findByOrderId(orderId: string): Promise<ICancellationRelationsDTO | null> {
        const canllation = await prisma.cancellation.findUnique({
            where: {
                orderId
            },
        })

        return canllation as unknown as ICancellationRelationsDTO
    }
    async countByPendingAndUserId(userId?: string | null, shopkeeperId?: string | null): Promise<number> {
        const count = await prisma.cancellation.count({
            where: {
                status: Status.PENDING,
                shopkeeperId: shopkeeperId ?? undefined,
                user:{
                    id: userId ?? undefined
                }
            }
        })

        return count
    }
    async listByStatusAndAdmin(status: Status, page = 1) {
        const cancellations = await prisma.cancellation.findMany({
            where: {
                status,
            },
            skip: (page - 1) * 13,
            take: 13,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                status: true,
                shopkeeperId: true,
                shopkeeperName: true,
                reason: true,
                notification: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                order: {
                    select: {
                        id: true,
                        code: true,
                        total: true,
                        status: true,
                        description: true,
                        payment: true,
                        items: true,
                        delivery: true,
                    },
                },
                cancellationMessages: true,
                createdAt: true,
            }   
        }) as unknown as ICancellationRelationsDTO[]

        // Ordena as mensagens de cancelamento
        cancellations.forEach(cancellation => {
            cancellation.cancellationMessages = cancellation.cancellationMessages
                .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        });

        const countPage = await prisma.cancellation.count({
            where: {
                status,
            },
        })
    
        const totalPages = countPage > 0 ? Math.ceil(countPage / 13) : 0
    
    
        return {
            cancellations,
            totalPages
        }
    }
    async listByStatusAndShopkeeperId(status: Status, shopkeeperId: string, page = 1) {
        const cancellations = await prisma.cancellation.findMany({
            where: {
                status,
                shopkeeperId
            },
            skip: (page - 1) * 13,
            take: 13,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                status: true,
                shopkeeperId: true,
                shopkeeperName: true,
                reason: true,
                notification: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                order: {
                    select: {
                        id: true,
                        code: true,
                        total: true,
                        status: true,
                        description: true,
                        payment: true,
                        items: true,
                        delivery: true,
                    },
                },
                cancellationMessages: true,
                createdAt: true,
            }   
        }) as unknown as ICancellationRelationsDTO[]

        // Ordena as mensagens de cancelamento
        cancellations.forEach(cancellation => {
            cancellation.cancellationMessages = cancellation.cancellationMessages
                .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        });

        const countPage = await prisma.cancellation.count({
            where: {
                status,
                shopkeeperId
            },
        })
    
        const totalPages = countPage > 0 ? Math.ceil(countPage / 13) : 0
    
        return {
            cancellations,
            totalPages
        }
    }
    async listByStatusAndUserId(status: Status, userId: string, page = 1) {
        const cancellations = await prisma.cancellation.findMany({
            where: {
                status,
                userId
            },
            skip: (page - 1) * 13,
            take: 13,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                status: true,
                shopkeeperId: true,
                shopkeeperName: true,
                reason: true,
                notification: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                order: {
                    select: {
                        id: true,
                        code: true,
                        total: true,
                        status: true,
                        description: true,
                        payment: true,
                        items: true,
                        delivery: true,
                    },
                },
                cancellationMessages: true,
                createdAt: true,
            }   
        }) as unknown as ICancellationRelationsDTO[]


        cancellations.forEach(cancellation => {
            cancellation.cancellationMessages = cancellation.cancellationMessages
                .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        });
    
        const countPage = await prisma.cancellation.count({
            where: {
                status,
                userId
            },
        })
    
        const totalPages = countPage > 0 ? Math.ceil(countPage / 13) : 0
    
        return {
            cancellations,
            totalPages
        };
        
    }
    async listByShopkeeper(shopkeeperId: string, page = 1) {
        const cancellations = await prisma.cancellation.findMany({
            where: {
                shopkeeperId
            },
            skip: (page - 1) * 13,
            take: 13,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                status: true,
                shopkeeperId: true,
                shopkeeperName: true,
                reason: true,
                notification: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                order: {
                    select: {
                        id: true,
                        code: true,
                        total: true,
                        status: true,
                        description: true,
                        payment: true,
                        items: true,
                        delivery: true,
                    }
                },
                cancellationMessages: true,
                createdAt: true,
            }
        }) as unknown as ICancellationRelationsDTO[]

     // Ordena as mensagens de cancelamento
     cancellations.forEach(cancellation => {
        cancellation.cancellationMessages = cancellation.cancellationMessages
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    });


    const countPage = await prisma.cancellation.count({
        where: {
            shopkeeperId
        }
    })

    const totalPages = countPage > 0 ? Math.ceil(countPage / 13) : 0

    return {
        cancellations,
        totalPages
    };
        
    }
    async listByUser(userId: string, page = 1) {
        const cancellations = await prisma.cancellation.findMany({
            where: {
                userId
            },
            skip: (page - 1) * 13,
            take: 13,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                status: true,
                shopkeeperId: true,
                shopkeeperName: true,
                reason: true,
                notification: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                order: {
                    select: {
                        id: true,
                        code: true,
                        total: true,
                        status: true,
                        description: true,
                        payment: true,
                        items: true,
                        delivery: true,
                    }
                },
                cancellationMessages: true,
                createdAt: true,
            }
        }) as unknown as ICancellationRelationsDTO[]

        // Ordena as mensagens de cancelamento
        cancellations.forEach(cancellation => {
            cancellation.cancellationMessages = cancellation.cancellationMessages
                .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        });


        const countPage = await prisma.cancellation.count({
            where: {
                userId
            }
        })

        const totalPages = countPage > 0 ? Math.ceil(countPage / 13) : 0
    
        return {
            cancellations,
            totalPages
        };
    }
    async list(page = 1) {
        const cancellations = await prisma.cancellation.findMany({
            skip: (page - 1) * 13,
            take: 13,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                status: true,
                shopkeeperId: true,
                shopkeeperName: true,
                reason: true,
                notification: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                order: {
                    select: {
                        id: true,
                        code: true,
                        total: true,
                        status: true,
                        description: true,
                        payment: true,
                        items: true,
                        delivery: true,
                    }
                },
                cancellationMessages: true,
                createdAt: true,
            }
        }) as unknown as ICancellationRelationsDTO[]

        const countPage = await prisma.cancellation.count()

        const totalPages = countPage > 0 ? Math.ceil(countPage / 13) : 0 > 0 ? Math.ceil(countPage / 13) : 0

        return {
            cancellations,
            totalPages
        };
    }
    async create(data: Prisma.CancellationUncheckedCreateInput){
        const cancellation = await prisma.cancellation.create({
            data,
            select: {
                id: true,
                status: true,
                shopkeeperId: true,
                shopkeeperName: true,
                reason: true,
                notification: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                order: {
                    select: {
                        id: true,
                        code: true,
                        total: true,
                        status: true,
                        description: true,
                        payment: true,
                        items: true,
                        delivery: true,
                    }
                },
                cancellationMessages: true,
                createdAt: true,
            }
        }) as unknown as ICancellationRelationsDTO

        return cancellation
    }
    async findById(id: string){
        const cancellation = await prisma.cancellation.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                status: true,
                shopkeeperId: true,
                shopkeeperName: true,
                reason: true,
                notification: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                order: {
                    select: {
                        id: true,
                        code: true,
                        total: true,
                        status: true,
                        description: true,
                        payment: true,
                        items: true,
                        delivery: true,
                        user:{
                            select:{
                                id: true,
                                name: true,
                                email: true,
                                role: true
                            }
                        },
                        createdAt: true
                    }
                },
                cancellationMessages: {
                    select:{
                        id: true,
                        message: true,
                        imageUrl: true,
                        createdAt: true,
                        user:{
                            select:{
                                id: true,
                                name: true,
                                avatarUrl: true,
                                role: true
                            }
                        }
                    }
                },
                createdAt: true,
            }
        }) as unknown as ICancellationRelationsDTO

        const formatCancellationMessage = cancellation.cancellationMessages.map((message: ICancellationMessageRelationsDTO) => {
            return {
                id: message.id,
                message: message.message,
                imageUrl: message.imageUrl,
                createdAt: message.createdAt,
                user: {
                    id: message.user.id,
                    name: message.user.name,
                    avatarUrl: message.user.avatarUrl,
                    role: message.user.role
                }
            }
        })

        return {
            ...cancellation,
            // Ordena da mais antiga para a mais recente
            cancellationMessages: formatCancellationMessage.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()) as ICancellationMessageRelationsDTO[]
        }
    }
    async changeStatus(cancellationId: string, status: Status){
        await prisma.cancellation.update({
            where: {
                id: cancellationId
            },
            data: {
                status
            }
        })
    }
}