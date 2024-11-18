import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { IAddressesRepository } from "../interfaces/interface-addresses-repository";

export class PrismaAddressesRepository implements IAddressesRepository{
    async deleteById(id: string): Promise<void> {
        await prisma.address.delete({
            where: {id}
        })
    }
    async create(data: Prisma.AddressUncheckedCreateInput){
        const address = await prisma.address.create({data})

        return address;
    }
    async findById(id: string){
        const address = await prisma.address.findUnique({where: {id}})

        return address;
    }
    async updateById(data: Prisma.AddressUncheckedUpdateInput){
        const address = await prisma.address.update({where: {id: data.id as string}, data})

        return address;
    }
}