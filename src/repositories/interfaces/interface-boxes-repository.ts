import {Box, Prisma} from "@prisma/client"
export interface IBoxesRepository {
    create(data: Prisma.BoxUncheckedCreateInput): Promise<Box>;
    findById(id: string): Promise<Box | null>;
    list(): Promise<Box[]>;
    updateById(data: Prisma.BoxUncheckedUpdateInput): Promise<Box>;
    deleteById(id: string): Promise<void>;
}