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
    async save({
        freightId,
        freightLink,
        trackingLink,
    }: ICreateFreight): Promise<Freight> {
        const freight = await prisma.freight.update({
            where: {
                freightId: freightId as string
            },
            data:{
                freightLink,
                trackingLink,
            }
        })

        return freight
    }
    async create(data: Prisma.FreightUncheckedCreateInput): Promise<Freight> {
        const freight = await prisma.freight.create({data})

        return freight
    }
}