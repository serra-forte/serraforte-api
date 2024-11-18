import { PrismaBoxesRepository } from "@/repositories/prisma/prisma-boxes-repository";
import { AppError } from "@/usecases/errors/app-error";
import { Box } from "@prisma/client";

interface IRequestFindByIdBox {
    id: string;
}

export class FindByIdBoxesUseCase {
    constructor(
        private boxesRepository: PrismaBoxesRepository
    ){}

    async execute({
        id,
    }: IRequestFindByIdBox): Promise<Box> {
        // buscar box pelo id
        const findBoxExists = await this.boxesRepository.findById(id)

        // validar se box existe
        if(!findBoxExists){
            throw new AppError('Box not found', 404)
        }

        return findBoxExists
    }
}