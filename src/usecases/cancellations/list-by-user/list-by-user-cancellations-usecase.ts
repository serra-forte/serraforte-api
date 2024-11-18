import { ICancellationRelationsDTO } from "@/dtos/cancellation-relations.dto";
import { ICancellationRepository } from "@/repositories/interfaces/interface-cancellations-repository";
import { IUsersRepository } from "@/repositories/interfaces/interface-users-repository";
import { AppError } from "@/usecases/errors/app-error";

interface IRequestListCancellationsByUser{
    userId: string
    page?: number | null
}

export class ListCancellationsByUserUseCase {
    constructor(
        private cancellationRepository: ICancellationRepository,
        private userRepository: IUsersRepository
    ){}

    async execute({
        userId,
        page
    }: IRequestListCancellationsByUser): Promise<ICancellationRelationsDTO[]> {
        // buscar por id do usuario
        const findUserExist = await this.userRepository.findById(userId)

        // validar se o usuario existe
        if(!findUserExist) {
            throw new AppError("Usuário não encontrado", 404)
        }

        const cancellations = await this.cancellationRepository.listByUser(userId, page)

        return cancellations
    }
}