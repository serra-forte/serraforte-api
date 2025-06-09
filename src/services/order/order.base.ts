import { Order } from "@prisma/client";
import { ICreateDeliveryOrderRequest } from "../interfaces/request/create-delivery-order.interface";
import { ICreatePickUpOrderRequest } from "../interfaces/request/create-pick-up-order.interface";
import { IOrderRelationsDTO } from "@/dtos/order-relations.dto";

export abstract class OrderServiceBase {
    abstract createDeliveryOrder(data: ICreateDeliveryOrderRequest): Promise<IOrderRelationsDTO>
    abstract createWithdrawOrder(data: ICreatePickUpOrderRequest): Promise<IOrderRelationsDTO>
    abstract deleteById(id: string): Promise<boolean>
}