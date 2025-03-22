import { Prisma } from "@prisma/client";
import { ICreateFreight, IFreightsRepository } from "../interfaces/interface-freights-repository";
import { prisma } from "@/lib/prisma";

export class PrismaFreightRepository implements IFreightsRepository {
    async save(deliveryId: string, {
        companyName,
        freightId,
        freightLink,
        trackingLink,
        serviceId,
        serviceName
    }: ICreateFreight): Promise<void> {
        await prisma.freight.updateMany({
            where: {
                deliveryId
            },
            data:{
                freightId,
                freightLink,
                trackingLink,
                serviceId,
                serviceName,
                companyName
            }
        })
    }
    async create(data: Prisma.FreightUncheckedCreateInput): Promise<void> {
        await prisma.freight.create({
            data
        })
    }
}