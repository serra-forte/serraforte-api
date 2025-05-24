import { Prisma, Store } from "@prisma/client";
import { IStoreRepository } from "../interfaces/interface-store-repository";
import { prisma } from "@/lib/prisma";

export class PrismaStoreRepository implements IStoreRepository{
    async create(data: Prisma.StoreUncheckedCreateInput): Promise<Store> {
        const store = await prisma.store.create({data})

        return store
    }
    async findByUserId(userId: string): Promise<Store | null> {
        const store = await prisma.store.findFirst({where: {userId}})

        return store
    }
}