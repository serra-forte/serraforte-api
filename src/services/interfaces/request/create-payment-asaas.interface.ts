import { IUserRelations } from "@/dtos/user-relations.dto";
import { ICreditCardPaymentData } from "@/interfaces/credit-card.interface";
import { PaymentMethod } from "@prisma/client";

export interface ICreatePaymentAsaas {
    customer?: string | null
    user: IUserRelations,
    billingType: PaymentMethod,
    dueDate: string,
    value: number,
    description: string,
    remoteIp: string,
    creditCardData?: ICreditCardPaymentData | null
}