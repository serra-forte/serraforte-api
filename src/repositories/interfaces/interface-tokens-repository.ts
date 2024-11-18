import { Prisma, Token } from "@prisma/client"

export interface ITokensRepository {
    create(data:Prisma.TokenUncheckedCreateInput):Promise<Token>
    findByToken(token:string):Promise<Token | null>
    findByUserId(userId:string):Promise<Token | null>
    findTokenAuth(userId:string, auth: string):Promise<Token | null>
    findByUserAndToken(userId:string, token:string):Promise<Token | null>
    delete(id:string):Promise<void>
    deleteAll():Promise<void>
    deleteByUser(userId: string): Promise<void>
}