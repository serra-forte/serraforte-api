import { ICancellationRepository } from "@/repositories/interfaces/interface-cancellations-repository";
import { Role, Status } from "@prisma/client";

export interface IRequestListByStatus {
    status: Status
    userId: string
    role: Role
    page?: number | null
}

export class ListCancellationByStatusUseCase {
    constructor(
        private cancellationsRepository: ICancellationRepository
    ) {}

    async execute({ 
        status, 
        userId,
        role,
        page
    }: IRequestListByStatus) {
        if(role === 'SHOPKEEPER') {
            const cancellations = await this.cancellationsRepository.listByStatusAndShopkeeperId(status, userId, page)
            return cancellations
        }

        if(role === 'ADMIN' || role === 'SUPER'){
            const cancellations = await this.cancellationsRepository.listByStatusAndAdmin(status, page)
            return cancellations
        }

        const cancellations = await this.cancellationsRepository.listByStatusAndUserId(status, userId, page)
        return cancellations
    }
}