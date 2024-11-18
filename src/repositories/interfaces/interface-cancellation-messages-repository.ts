import { CancellationMessage, Prisma } from "@prisma/client"

export interface ICancellationMessagesRepository {
    create(data: Prisma.CancellationMessageUncheckedCreateInput):Promise<CancellationMessage>
}