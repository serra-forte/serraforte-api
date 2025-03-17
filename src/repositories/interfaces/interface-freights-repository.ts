import { Prisma } from "@prisma/client";

export interface IFreightsRepository {
    create(data: Prisma.FreightUncheckedCreateInput): Promise<void>;
    save(deliveryId: string, freightId: string): Promise<void>
}