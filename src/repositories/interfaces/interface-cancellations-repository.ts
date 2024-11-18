import { IResponseListCancellationsByUser } from '@/usecases/cancellations/list-by-shopkeeper/list-by-shopkeeper-cancellations-usecase';
import { ICancellationRelationsDTO } from './../../dtos/cancellation-relations.dto';
import { Cancellation, Prisma, Role, Status } from "@prisma/client"



export interface ICancellationRepository {
    create(data: Prisma.CancellationUncheckedCreateInput):Promise<ICancellationRelationsDTO>
    findById(id:string): Promise<ICancellationRelationsDTO>
    changeStatus(cancellationId: string, status: Status): Promise<void>
    countByPendingAndUserId(userId?:string | null, shopkeeperId?:string | null): Promise<number>

    list(page?: number | null):Promise<IResponseListCancellationsByUser>
    listByUser(userId:string, page?: number | null): Promise<IResponseListCancellationsByUser>
    listByShopkeeper(shopkeeperId:string, page?: number | null): Promise<IResponseListCancellationsByUser>
    listByStatusAndUserId(status:Status, userId:string, page?: number | null): Promise<IResponseListCancellationsByUser>
    listByStatusAndShopkeeperId(status:Status, shopkeeperId:string, page?: number | null): Promise<IResponseListCancellationsByUser>
    listByStatusAndAdmin(status:Status, page?: number | null): Promise<IResponseListCancellationsByUser>
}