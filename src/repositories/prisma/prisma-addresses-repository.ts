import { Address, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { IAddressesRepository } from "../interfaces/interface-addresses-repository";

export class PrismaAddressesRepository implements IAddressesRepository{
  async setLastUsedAddress(addressId: string, userId: string): Promise<boolean> {
        await prisma.$transaction([
            prisma.address.updateMany({
                where: {
                userId,
                isLastUsed: true
                },
                data: { isLastUsed: false }
            }),
            prisma.address.update({
                where: { id: addressId },
                data: { isLastUsed: true }
            })
        ]);

        return true
    }

    async listByUser(userId: string): Promise<Address[]> {
        const addresses = await prisma.address.findMany({
            where: {
                userId,
                active: false
            }
        })

        return addresses
    }
    async findByActive(userId: string): Promise<Address | null> {
        const address = await prisma.address.findFirst({
            where: {
                userId,  
                active: true
            }
        })

        return address
    }
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