import { Prisma, CancellationMessage } from '@prisma/client';
import { ICancellationMessagesRepository } from '../interfaces/interface-cancellation-messages-repository';
import { prisma } from '../../lib/prisma';
export class PrismaCancellationMessagesRepository implements ICancellationMessagesRepository{
    async create(data: Prisma.CancellationMessageUncheckedCreateInput){
        const cancellationMessage = await prisma.cancellationMessage.create({data})

        return cancellationMessage
    }
}