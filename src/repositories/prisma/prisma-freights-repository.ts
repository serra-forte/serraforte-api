import { Prisma } from "@prisma/client";
import { ICreateFreight, IFreightsRepository } from "../interfaces/interface-freights-repository";
import { prisma } from "@/lib/prisma";

export class PrismaFreightRepository implements IFreightsRepository {
    async save(deliveryId: string, {
        freightId,
        freightLink,
        trackingLink,
    }: ICreateFreight): Promise<void> {
        await prisma.freight.updateMany({
            where: {
                deliveryId
            },
            data:{
                freightId,
                freightLink,
                trackingLink,
            }
        })
    }
    async create(data: Prisma.FreightUncheckedCreateInput): Promise<void> {
        await prisma.freight.create({
            data
        })
    }
}