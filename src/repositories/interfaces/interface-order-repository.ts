import { IOrderRelationsDTO } from "@/dtos/order-relations.dto"
import { Order, Prisma, Status } from "@prisma/client"

export interface IResponseListOrders{
    orders: Order[]
    totalPages: number
}

export interface IFilterOrders {
    code?: string | null
    client?: string | null
    paymentStatus?: string | null
    status?: Status | null
    total?: boolean | null | string
    date?: string | null    
    page?: number | null
}

export interface IOrderRepository {
    create(data: Prisma.OrderUncheckedCreateInput):Promise<Order>
    countBySentAndUserId(userId:string):Promise<number>
    list(page?: number | null):Promise<IResponseListOrders>
    listByShoppKeeper(userId: string, page?: number | null):Promise<IResponseListOrders>
    listByDeliveryMan(userId: string, page?: number | null):Promise<IResponseListOrders>
    listByAsaasPaymentId(asaasPaymentId:string):Promise<IOrderRelationsDTO[]>
    listByUserId(idUser:string, page?: number | null):Promise<IResponseListOrders>
    findById(id:string):Promise<Order | null>
    findByCode(code:string):Promise<Order | null>
    filterOrders(filters: IFilterOrders):Promise<IResponseListOrders>
    listByPaymentWithoutPaying24Hours():Promise<IOrderRelationsDTO[]>
    listByIds(orderIds:string[]):Promise<Order[]>
    deleteById(id:string):Promise<void>
    updateStatus(id: string, status: Status): Promise<void>
    countOrders(): Promise<number>
    addDescription(id: string, description: string): Promise<void>
    confirmWithdrawed(id: string, date: string): Promise<void>
    updateLabelDelivery(id: string, labelId: string, labelUrl: string): Promise<void>
    saveTrackingLink(id: string, trackingCode: string): Promise<void>
}