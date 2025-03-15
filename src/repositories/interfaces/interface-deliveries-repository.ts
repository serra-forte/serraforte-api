import { Delivery } from "@prisma/client";

export interface IConfirmDelivery{
    id: string
    deliveryDate: string
    receiverName: string
    receiverDocument: string
    longitude: number
    latitude: number
}

export interface IConfirmShipment{
    id: string
    shipmentDate: string
}

export interface IChooseDeliveryMan{
    deliveryId: string
    deliveryManId: string
}

export interface IDeliveryRepository {
    findById(id: string): Promise<Delivery | null>
    confirmShipment(data: IConfirmShipment): Promise<void>
    confirmDelivery(data: IConfirmDelivery): Promise<void>
    chooseDeliveryMan(data: IChooseDeliveryMan): Promise<void>
    addServiceIdToDelivery(serviceId: string, deliveryId: string): Promise<void>
    findByFreightId(id: string): Promise<Delivery | null>
    save(orderId:string, freightId: string): Promise<void>

}