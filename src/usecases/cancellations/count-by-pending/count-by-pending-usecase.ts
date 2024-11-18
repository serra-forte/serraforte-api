import { ICancellationRepository } from "@/repositories/interfaces/interface-cancellations-repository";
import { Role } from "@prisma/client";

export interface IRequestCountByPending {
    userId: string
    role: Role
}
export class CountByPendingUseCase {
    constructor(
        private cancellations: ICancellationRepository
    ) {}

    async execute({
        userId,
        role
    }: IRequestCountByPending) {
        if(role === 'ADMIN' || role === 'SUPER') {
            const count = await this.cancellations.countByPendingAndUserId()

            return count
        }else if(role === 'SHOPKEEPER'){
            const count = await this.cancellations.countByPendingAndUserId(null, userId)

            return count
        }else{
            const count = await this.cancellations.countByPendingAndUserId(userId)

            return count
        }
    }
}