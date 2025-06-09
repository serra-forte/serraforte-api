import { IOrderRelationsDTO } from "@/dtos/order-relations.dto";
import { IUserRelations } from "@/dtos/user-relations.dto";

export interface ISendOrderConfirmationEmail {
    order: IOrderRelationsDTO
    user: IUserRelations
    invoiceUrl: string
}