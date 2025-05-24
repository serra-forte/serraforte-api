import { Prisma, Store } from "@prisma/client";
import { IStoreRepository } from "../interfaces/interface-store-repository";
import { prisma } from "@/lib/prisma";

export class PrismaStoreRepository implements IStoreRepository{
    async list(): Promise<Store[]> {
        const stores = await prisma.store.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                description: true,
                companyName: true,
                document: true,
                stateRegister: true,
                address: true,
            }
        }) as unknown as Store[]
        
        return stores
    }
    async create(data: Prisma.StoreUncheckedCreateInput): Promise<Store> {
        const store = await prisma.store.create({data})

        return store
    }
    async findByUserId(userId: string): Promise<Store | null> {
        const store = await prisma.store.findFirst({where: {userId}})

        return store
    }
}