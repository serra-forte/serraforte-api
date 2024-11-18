import { Prisma, Box } from "@prisma/client";
import { IBoxesRepository } from "../interfaces/interface-boxes-repository";
import { prisma } from "@/lib/prisma";

export class PrismaBoxesRepository implements IBoxesRepository {
    async list(): Promise<Box[]> {
        const boxes = await prisma.box.findMany()

        return boxes
    }
    async create(data: Prisma.BoxUncheckedCreateInput): Promise<Box> {
        const box = await prisma.box.create({data})

        return box
    }
    async findById(id: string): Promise<Box | null> {
        const box = await prisma.box.findUnique({
            where: {
                id
            }
        })

        return box
    }
    async updateById(data: Prisma.BoxUncheckedUpdateInput): Promise<Box> {
        const box = await prisma.box.update({
            where: {
                id: data.id as string
            },
            data
        })

        return box
    }
    async deleteById(id: string): Promise<void> {
        await prisma.box.delete({
            where: {
                id
            }
        })
    }
}