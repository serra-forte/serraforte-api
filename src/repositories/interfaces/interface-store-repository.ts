import { Prisma, Store } from "@prisma/client";

export interface IStoreRepository {
    create(data: Prisma.StoreUncheckedCreateInput): Promise<Store>
    findByUserId(userId: string): Promise<Store | null>
    list(): Promise<Store[]>
}