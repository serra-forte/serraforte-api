import { Freight, Prisma } from "@prisma/client";
import { ICreateFreight, IFreightsRepository } from "../interfaces/interface-freights-repository";
import { prisma } from "@/lib/prisma";

export class PrismaFreightRepository implements IFreightsRepository {
    async findByFreightId(id: string): Promise<Freight | null> {
        const freight = await prisma.freight.findUnique({
            where: {
                freightId: id
            }
        })

        return freight
    }
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
    async create(data: Prisma.FreightUncheckedCreateInput): Promise<Freight> {
        const freight = await prisma.freight.create({data})

        return freight
    }
}