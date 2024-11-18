import { ICancellationRelationsDTO } from '@/dtos/cancellation-relations.dto';
import { ICancellationRepository } from "@/repositories/interfaces/interface-cancellations-repository"
import { AppError } from "@/usecases/errors/app-error"

interface IRequestFindCancellation{
    id: string
}

export class FindCancellationUseCase {
    constructor(
        private cancellationRepository: ICancellationRepository,
        ) {}

    async execute({
        id
    }: IRequestFindCancellation): Promise<ICancellationRelationsDTO>{
        // buscar cancelamento pelo id
        const findCancellationExist = await this.cancellationRepository.findById(id)

        // validar se existe cancelamento com o mesmo id
        if(!findCancellationExist){
            throw new AppError('Cancelamento não encontrado', 404)
        }

        // retornar cancelamento
        return findCancellationExist
    }
}