import { IOrderRelationsDTO } from "@/dtos/order-relations.dto";
import { ISendOrderConfirmationEmail } from "./interfaces/send-order-confirmation.interface";

export abstract class EventBusBase {
    abstract sendOrderConfirmationEmailEvent(data: ISendOrderConfirmationEmail): void
    abstract sendOrderApprovedEmailEvent(data: IOrderRelationsDTO): void
    abstract sendOrderReprovedEmailEvent(data: IOrderRelationsDTO): void
    abstract updateOrderConfirmedEvent(data: IOrderRelationsDTO): void
    abstract updateOrderReprovedEvent(data: IOrderRelationsDTO): void
}