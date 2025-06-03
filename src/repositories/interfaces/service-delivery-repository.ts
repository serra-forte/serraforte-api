import { Prisma } from "@prisma/client";

export interface IServiceDeliveryRepository {
    create(serviceDelivery: Prisma.SeviceDeliveryUncheckedCreateInput): Promise<IServiceDeliveryRepository>
}