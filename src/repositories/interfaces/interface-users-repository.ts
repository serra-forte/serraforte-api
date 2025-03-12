import { IUserRelations } from "@/dtos/user-relations.dto"
import { Prisma, User } from "@prisma/client"

export interface IExpiredRefundCredit{
    userId: string, 
    date?: string | null
}

export interface IResponseListUsers{
    users: User[],
    totalPages: number
}

export interface IUsersRepository {
    create(data:Prisma.UserUncheckedCreateInput): Promise<User>
    list(): Promise<User[]>
    listAdmins(): Promise<User[]>
    listByShopkeeper(): Promise<IResponseListUsers>
    listByDeliveryMan(page?: number | null, take?: number | null): Promise<IResponseListUsers>
    findById(id:string): Promise<User | null>
    getUserSecurity(id:string): Promise<User | null>
    findByEmail(email:string): Promise<User | null>
    findByCPF(cpf:string): Promise<User | null>
    findByPhone(phone:string): Promise<User | null>

    activeEmail(id:string, activate?: boolean): Promise<void | null>
    changePassword(id:string, password:string): Promise<void | null>
    update(data:Prisma.UserUncheckedUpdateInput): Promise<User>
    updateAsaasCostumerId(id:string, asaasCustomerId:string): Promise<User>
    turnAdmin(id:string): Promise<User | null>
    delete(id:string): Promise<void>
    uploadAvatarUrl(id:string, avatarUrl:string): Promise<void>
    activeSoftDelete(id:string): Promise<void>
}