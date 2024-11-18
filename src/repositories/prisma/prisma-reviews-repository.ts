import { prisma } from './../../lib/prisma';
import { Prisma, Review } from "@prisma/client";
import { IResponseListReviews, IReviewsRepository } from "../interfaces/interface-reviews-repository";
import { IReviewsRelationsDTO } from '@/dtos/reviews-relations.dto';

export class PrismaReviewsRepository implements IReviewsRepository {
    async countByCreated(userId?: string | null) {
        const count = await prisma.review.count({
            where: {
                userId: userId ?? undefined,
                active: null
            }
        })
        return count
    }
    async approve(reviewId: string, approved: boolean){
        await prisma.review.update({where: {id: reviewId}, data: {active: approved}})
    }
    async list(page?: number | null, userId?: string | null){
        const reviews = await prisma.review.findMany({
            skip: page ? (page - 1) * 13 : 0,  // Se a página não for fornecida, `skip` será 0
            take: 13,
            where: userId ? { 
                product:{
                    userId
                }
             } : {},  // Se `userId` for definido, aplica o filtro; caso contrário, busca todos
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                user: true,
                product: true,
                comment: true,
                active: true,
                rating: true,
                createdAt: true,
            }
        }) as IReviewsRelationsDTO[];
        
        const countPage = await prisma.review.count({
            where: {
                userId: userId ?? undefined
            }
        })

        const totalPages = countPage > 0 ? Math.ceil(countPage / 13) : 0


        return {
            reviews,
            totalPages
        }
    }
    async findById(id: string){
        const review = await prisma.review.findUnique({where: {id}})

        return review
    }
    async create(data: Prisma.ReviewUncheckedCreateInput) {
        const review = await prisma.review.create({data})

        return review
    }
    async delete(id: string): Promise<void> {
        await prisma.review.delete({where: {id}})
    }
    async update(data: Prisma.ReviewUncheckedUpdateInput) {
        const review = await prisma.review.update({
            where: {id: data.id as string},
            data
        })

        return review
    }
}