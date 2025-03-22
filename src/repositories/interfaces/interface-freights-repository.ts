import { Prisma } from "@prisma/client";

export interface ICreateFreight {
    serviceId?: number | null;
    serviceName?: string | null;
    freightId?: string | null;
    freightLink?: string | null;
    trackingLink?: string | null;
    companyName?: string | null;
    price?: number | null
}

export interface IFreightsRepository {
    create(data: Prisma.FreightUncheckedCreateInput): Promise<void>;
    save(deliveryId: string, data: ICreateFreight): Promise<void>
}