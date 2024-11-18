import { Prisma, Token } from "@prisma/client";
import { ITokensRepository } from "../interface-tokens-repository";
import { randomUUID } from "crypto";

export class InMemoryTokensRepository implements ITokensRepository {
    public tokens: Token[] = []
    
    async findByUserAndToken(userId: string, token: string){
        const userToken = this.tokens.find(userToken => 
                userToken.userId === userId &&
                userToken.token === token
            )

        if(!userToken){
            return null
        }

        return userToken;
    }

    async create({
        userId,
        expireDate,
        token,
    }: Prisma.TokenUncheckedCreateInput){
        const userToken = {
            id: randomUUID(),
            userId,
            expireDate: new Date(expireDate),
            token,
            createdAt: new Date()
        }

        this.tokens.push(userToken)

        return userToken
    }

   async findByToken(token: string) {
        const userToken = this.tokens.find(userToken => userToken.token === token)

        if(!userToken){
            return null
        }

        return userToken;
    }

    async findByUserId(userId: string){
        const userToken = this.tokens.find(userToken => userToken.userId === userId)

        if(!userToken){
            return null
        }

        return userToken;
    }

   async delete(id: string) {
        const userIndex = this.tokens.findIndex(userToken => userToken.id === id)

        this.tokens.splice(userIndex, 1)
    }

}