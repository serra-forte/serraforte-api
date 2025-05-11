import {  Prisma, Role, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { IUsersRepository } from '../interfaces/interface-users-repository';
import { IUserRelations } from "@/dtos/user-relations.dto";
export class PrismaUsersRepository implements IUsersRepository{
   
    async findShopkeeper(): Promise<User | null> {
        const user = await prisma.user.findFirst({
            where: { 
                role: 'SHOPKEEPER'
            },
            select: {
                id: true,
                address:true
            }
        }) as unknown as User

        return user
    }
    async activeSoftDelete(id: string): Promise<void> {
        await prisma.user.update({
            where: {
                id
            },
            data:{
                softDelete: true
            }
        })
    }
    async uploadAvatarUrl(id: string, avatarUrl: string) {
        await prisma.user.update({
            where: {
                id
            },
            data:{
                avatarUrl
            }
        })
    }
    async listByDeliveryMan(page = 1, take?: number | null) {
        const users = await prisma.user.findMany({
            where:{
                role: 'DELIVERYMAN' as Role
            },
            take: take ? take : 0,
            skip: take && page ? (page - 1) * take : 0,
            select: {
                id: true,
                name: true,
                avatarUrl: true,
                email: true,
                phone: true,
                asaasWalletId: true,
                paymentFee:true,
                paymentType: true,
            }
        }) as unknown as User[]

        const countPages = await prisma.user.count({
            where:{
                role: 'DELIVERYMAN' as Role
            }
        })

        const totalPages = countPages > 0 ? Math.ceil(countPages / 13) : 1
        

        return {
            users,
            totalPages
        }
    }
    async listByShopkeeper(page = 1, take = 13){
        const users = await prisma.user.findMany({
            where:{
                role: 'SHOPKEEPER' as Role
            },
            take,
            skip: (page - 1) * take,
            select: {
                id: true,
                asaasCustomerId: true,
                asaasWalletId: true,
                paymentFee:true,
                paymentType: true,
                name: true,
                avatarUrl: true,
                cpf: true,
                email: true,
                hasDeliveryMan: true,
                storeHours: true,
                emailActive: true,
                dateBirth: true,
                phone: true,
                role: true,
                erpUserId: true,
                refundCredit: true,
                expireRefundCredit: true,
                createdAt: true,
                shoppingCart: true,
                address:true,
                    deliverys: {
                        orderBy: {
                            createdAt: 'desc'
                        }
                    },
                products: true
            }
        }) as unknown as User[]

        const countPages = await prisma.user.count({
            where:{
                role: 'SHOPKEEPER' as Role
            }
        })

        const totalPages = countPages > 0 ? Math.ceil(countPages / 13) : 1

        return {
            users,
            totalPages
        }
    }
    async updateAsaasCostumerId(id: string, asaasCustomerId: string){
        const user = await prisma.user.update({
            where: {
                id
            },
            data:{
                asaasCustomerId
            }
        })
        return user
    }
    async findByPhone(phone: string){
        const user = await prisma.user.findUnique({
            where: {phone},
            select: {
                id: true,
                asaasCustomerId: true,
                asaasWalletId: true,
                paymentFee:true,
                paymentType: true,
                name: true,
                avatarUrl: true,
                cpf: true,
                email: true,
                hasDeliveryMan: true,
                storeHours: true,
                emailActive: true,
                dateBirth: true,
                phone: true,
                role: true,
                erpUserId: true,
                refundCredit: true,
                expireRefundCredit: true,
                createdAt: true,
                shoppingCart: true,
                address:true,
                    deliverys: {
                        orderBy: {
                            createdAt: 'desc'
                        }
                    },
                products: true
            }
        }) as unknown as User

        return user
    }
    async listAdmins(){
        const users = await prisma.user.findMany({
            where:{
                role: 'ADMIN' as Role
            },
            select: {
                id: true,
                asaasWalletId: true,
                paymentFee:true,
                paymentType: true,
                name: true,
                avatarUrl: true,
                cpf: true,
                email: true,
                hasDeliveryMan: true,
                storeHours: true,
                emailActive: true,
                dateBirth: true,
                phone: true,
                role: true,
                erpUserId: true,
                refundCredit: true,
                expireRefundCredit: true,
                createdAt: true,
                shoppingCart: true,
                address:true,
                deliverys: {
                    orderBy: {
                        createdAt: 'desc',
                    }
                },
                products: true
            }
        }) as unknown as User[]
    
        return users

    }
    async findByIdCostumerPayment(id: string){
        const user = await prisma.user.findFirst({
            where:{
                asaasCustomerId: id
            }
        })
        return user
    }
    async getUserSecurity(id: string){
        const user = await prisma.user.findUnique({
            where:{
                id
            },
            select: {
                id: true,
                asaasWalletId: true,
                paymentFee:true,
                paymentType: true,
                name: true,
                avatarUrl: true,
                cpf: true,
                email: true,
                hasDeliveryMan: true,
                storeHours: true,
                emailActive: true,
                dateBirth: true,
                phone: true,
                role: true,
                erpUserId: true,
                refundCredit: true,
                expireRefundCredit: true,
                createdAt: true,
                shoppingCart: true,
                address:true,
                deliverys: {
                    orderBy: {
                        createdAt: 'desc',
                    }
                },
                products: true
            }
        }) as unknown as User

        return user
    }
    async changePassword(id: string, password: string){
        const user = await prisma.user.update({
            where: {
                id
            },
            data:{
                password
            }
        })
    }
    async updateIdCostumerPayment(ListUserDifferentToPacientUseCase: string, idCustomerPayment: string | null){
        const user = await prisma.user.update({
            where: {
                id: ListUserDifferentToPacientUseCase
            },
            data:{
                asaasCustomerId: idCustomerPayment
            },
        })

        return user
    }
    async turnAdmin(id: string){
        const user = await prisma.user.update({
            where:{
                id
            },
            data:{
                role: 'ADMIN' as Role
            },
            select: {
                id: true,
                asaasCustomerId: true,
                asaasWalletId: true,
                paymentFee:true,
                paymentType: true,
                name: true,
                avatarUrl: true,
                cpf: true,
                email: true,
                hasDeliveryMan: true,
                storeHours: true,
                emailActive: true,
                dateBirth: true,
                phone: true,
                role: true,
                erpUserId: true,
                refundCredit: true,
                expireRefundCredit: true,
                createdAt: true,
                shoppingCart: true,
                deliverys: {
                    orderBy: {
                        createdAt: 'desc',
                    }
                },
                address:true,
            }
        }) as unknown as User

        return user
    }
    async findByCPF(cpf: string){
        const user = await prisma.user.findUnique({
            where: {cpf},
            select: {
                id: true,
                asaasCustomerId: true,
                asaasWalletId: true,
                paymentFee:true,
                paymentType: true,
                name: true,
                avatarUrl: true,
                cpf: true,
                email: true,
                hasDeliveryMan: true,
                storeHours: true,
                emailActive: true,
                dateBirth: true,
                phone: true,
                role: true,
                erpUserId: true,
                refundCredit: true,
                expireRefundCredit: true,
                createdAt: true,
                shoppingCart: true,
                deliverys: {
                    orderBy: {
                        createdAt: 'desc',
                    }
                },
                address:true,
            }
        }) as unknown as User

        return user
    }
    async create(data: Prisma.UserUncheckedCreateInput){
        const user = await prisma.user.create(
            {
                data,
                select: {
                    id: true,
                    asaasWalletId: true,
                    paymentFee:true,
                    paymentType: true,
                    name: true,
                    avatarUrl: true,
                    cpf: true,
                    email: true,
                    emailActive: true,
                    dateBirth: true,
                    phone: true,
                    role: true,
                    erpUserId: true,
                    refundCredit: true,
                    expireRefundCredit: true,
                    shoppingCart: true,
                    createdAt: true,
                    products: true,
                        deliverys: {
                            orderBy: {
                                createdAt: 'desc'
                            }
                        },
                    address:true,
                }
            }) as unknown as User
        return user
    }
    async list(){
        const users = await prisma.user.findMany({
            select: {
                id: true,
                asaasCustomerId: true,
                asaasWalletId: true,
                paymentFee:true,
                paymentType: true,
                name: true,
                avatarUrl: true,
                cpf: true,
                email: true,
                hasDeliveryMan: true,
                storeHours: true,
                emailActive: true,
                dateBirth: true,
                phone: true,
                role: true,
                erpUserId: true,
                createdAt: true,
                shoppingCart: true,
                products: true,
                incomeValue: true,
                deliverys: {
                    orderBy: {
                        createdAt: 'desc',
                    }
                },
                address:true,
            }
        }) as unknown as User[]

        return users
    }
    async findById(id: string){
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                asaasCustomerId: true,
                shoppingCart: {
                    select: {
                        id: true
                    }
                },
                asaasWalletId: true,
                paymentFee: true,
                paymentType: true,
                name: true,
                avatarUrl: true,
                cpf: true,
                password: true,
                email: true,
                emailActive: true,
                dateBirth: true,
                phone: true,
                role: true,
                erpUserId: true,
                refundCredit: true,
                expireRefundCredit: true,
                createdAt: true,
                products: true,
                deliverys: {
                    orderBy: {
                        createdAt: 'desc',
                    }
                },
                address: true
            }
        }) as unknown as User

        return user
    }
    async findByEmail(email: string){
        const user = await prisma.user.findUnique({
            where: {email},
            select: {
                id: true,
                asaasCustomerId: true,
                asaasWalletId: true,
                paymentFee:true,
                paymentType: true,
                name: true,
                avatarUrl: true,
                cpf: true,
                password: true,
                email: true,
                emailActive: true,
                dateBirth: true,
                phone: true,
                role: true,
                erpUserId: true,
                createdAt: true,
                shoppingCart: true,
                address:true,
                softDelete: true,
                deliverys: {
                    orderBy: {
                        createdAt: 'desc',
                    }
                },
                products: true
            }
        }) as unknown as User

        return user
    }
    async activeEmail(id: string){
        await prisma.user.update({
            where: {
                id
            },
            data:{
                emailActive: true
            }
        })
    }
    async update(data: Prisma.UserUncheckedUpdateInput){
        const user = await prisma.user.update({
            where: {
                id: data.id as string
            },
            select: {
                id: true,
                asaasWalletId: true,
                paymentFee:true,
                paymentType: true,
                name: true,
                avatarUrl: true,
                cpf: true,
                email: true,
                hasDeliveryMan: true,
                storeHours: true,
                emailActive: true,
                dateBirth: true,
                phone: true,
                role: true,
                erpUserId: true,
                createdAt: true,
                shoppingCart: true,
                address:true,
                deliverys: {
                    orderBy: {
                        createdAt: 'desc',
                    }
                },
            },
            data
        }) as unknown as User

        return user
    }
    async delete(id: string){
        await prisma.user.delete({
            where: {
                id
            }
        })
    }
}