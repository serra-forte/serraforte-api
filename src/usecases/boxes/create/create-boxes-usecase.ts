import { PrismaBoxesRepository } from "@/repositories/prisma/prisma-boxes-repository";
import { Box } from "@prisma/client";

interface IRequestCreateBox {
    name: string;
    description?: string | null;
    weight: number;
    height: number;
    length: number;
    width: number;
    amount: number;
}

export class CreateBoxesUseCase {
    constructor(
        private boxesRepository: PrismaBoxesRepository
    ){}

    async execute({
        name,
        description,
        weight,
        amount,
        height,
        length,
        width
    }: IRequestCreateBox): Promise<Box> {
        const box = await this.boxesRepository.create({
            name,
            description,
            weight,
            amount,
            height,
            length,
            width
        });
        return box;
    }
}