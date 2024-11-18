import { Role } from "@prisma/client";
import { Message } from "./in-memory/in-memory-mail-provider";
import { IOrderRelationsDTO } from "@/dtos/order-relations.dto";

export interface Variables {
    data?: string
    value?: number
    password?: string | null
    role?: Role | null
    order?: IOrderRelationsDTO
    text?: string,
    message?: string | null
}

export interface IMailProvider {
    sendEmail(
        email: string, 
        name:string, 
        subject:string, 
        link:string | null, 
        pathTemplate:string,
        variables:  Variables | null
    ): Promise<void>

    findMessageSent(email: string): Promise<Message>
}