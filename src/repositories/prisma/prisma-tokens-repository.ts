import { Prisma, Token } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { ITokensRepository } from "../interfaces/interface-tokens-repository";

export class PrismaTokensRepository implements ITokensRepository{
    async findTokenAuth(userId: string, auth: string){
        const token = await prisma.token.findFirst({
            where: {userId, token: auth}
        })
        return token
    }

    async deleteByUser(userId: string): Promise<void> {
        await prisma.token.deleteMany({
          where: {
            userId,
          },
        })
      }
      
    async deleteAll(){
        await prisma.token.deleteMany()
    }
    async create(data: Prisma.TokenUncheckedCreateInput){
       const token = await prisma.token.create({data})
       return token
    }

    async findByToken(token: string){
        const tokenData = await prisma.token.findUnique({
            where: {token},
            select:{
                token: true,
                expireDate: true,
                tokenGoogle: true,
                userId: true,
                id:true,
                user: true
            }
        }) as unknown as Token
        
        return tokenData
    }

    async findByUserId(userId: string){
        const token = await prisma.token.findFirst({where: {userId}})

        return token
    }

    async findByUserAndToken(userId: string, token: string){
        const tokenData = await prisma.token.findFirst({
            where: {userId, token},
            select:{
                id:true,
                token: true,
                expireDate: true,
                tokenGoogle: true,
                user: true
            }}) as unknown as Token
        return tokenData
    }
    
    async delete(id: string): Promise<void> {
        await prisma.token.delete({where: {id}})
    }
}