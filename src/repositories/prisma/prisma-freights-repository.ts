import { Prisma } from "@prisma/client";
import { IFreightsRepository } from "../interfaces/interface-freights-repository";
import { prisma } from "@/lib/prisma";

export class PrismaFreightRepository implements IFreightsRepository {
    async save(deliveryId: string, freightId: string): Promise<void> {
        await prisma.freight.updateMany({
            where: {
                deliveryId
            },
            data:{
                freightId
            }
        })
    }
    async create(data: Prisma.FreightUncheckedCreateInput): Promise<void> {
        await prisma.freight.create({
            data
        })
    }
}