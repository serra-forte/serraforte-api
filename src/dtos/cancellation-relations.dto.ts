import { Status, User } from "@prisma/client";
import { IOrderRelationsDTO } from "./order-relations.dto";
import { ICancellationMessageRelationsDTO } from "./cancellation-message-relations";

export interface ICancellationRelationsDTO{
    id: string,
    user: User,
    order: IOrderRelationsDTO,
    cancellationMessages: ICancellationMessageRelationsDTO[],
    status: Status,
    createdAt: Date,
    updatedAt: Date,
}