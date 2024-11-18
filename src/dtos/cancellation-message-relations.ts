import { User } from "@prisma/client"

export interface ICancellationMessageRelationsDTO {
    id: string
    message: string
    imageUrl: string | null
    createdAt: Date
    user: User
}