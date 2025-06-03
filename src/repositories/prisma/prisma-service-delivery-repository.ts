import { prisma } from "@/lib/prisma";
import { IServiceDeliveryRepository } from "../interfaces/service-delivery-repository";
import { Prisma } from "@prisma/client";

export class PrismaServiceDeliveryRepository implements IServiceDeliveryRepository{
    async create(serviceDelivery: Prisma.SeviceDeliveryUncheckedCreateInput): Promise<IServiceDeliveryRepository> {
        const newServiceDelivery = await prisma.seviceDelivery.create({
            data: serviceDelivery
        }) as unknown as IServiceDeliveryRepository

        return newServiceDelivery
    }
}