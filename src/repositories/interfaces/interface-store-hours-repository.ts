import { Prisma, StoreHours } from "@prisma/client";

export interface IStoreHoursRepository {
    create(data: Prisma.StoreHoursUncheckedCreateInput): Promise<StoreHours>
}