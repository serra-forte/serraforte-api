import { ICancellationRepository } from "@/repositories/interfaces/interface-cancellations-repository";
import { IOrderRepository } from "@/repositories/interfaces/interface-order-repository";
import { IReviewsRepository } from "@/repositories/interfaces/interface-reviews-repository";
import { Role } from "@prisma/client";

export interface IRequestCountBySent {
    userId: string
    role: Role
}
export class CountBySentUseCase {
    constructor(
        private orderRepository: IOrderRepository
    ) {}

    async execute({
        userId,
        role
    }: IRequestCountBySent) {
        if(role === 'DELIVERYMAN') {
            const count = await this.orderRepository.countBySentAndUserId(userId)

            return count
        }
    }
}