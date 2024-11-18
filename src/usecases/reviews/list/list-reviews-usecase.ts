import { IResponseListReviews, IReviewsRepository } from "@/repositories/interfaces/interface-reviews-repository"

export interface IRequestListReviews{
    page?: number | null
    role: string
    userId: string
}

export class ListReviewsUseCase{

    constructor(
        private reviewsRepository: IReviewsRepository,
    ){}

    async execute({
        page,
        role,
        userId
    }: IRequestListReviews): Promise<IResponseListReviews | []>{
        // listar todos os reviews se for ADMIN ou SUPER
        if(role === 'ADMIN' || role === 'SUPER'){
            const reviews = await this.reviewsRepository.list(page)
            return reviews
        }else if(role === 'SHOPKEEPER'){ // lista todos os reviews se for SHOPKEEPER com os produtos igual ao id do shopkeeper 
            const reviews = await this.reviewsRepository.list(page, userId)
            return reviews
        }

        return []
    }
}