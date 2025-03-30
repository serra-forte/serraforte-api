import { IChooseDeliveryMan, IConfirmDelivery, IConfirmShipment, IDeliveryRepository } from "@/repositories/interfaces/interface-deliveries-repository";
import { prisma } from '@/lib/prisma'
import { Delivery, Prisma } from "@prisma/client";

export class PrismaDeliveryRepository implements IDeliveryRepository{
    async save(orderId:string, data: Prisma.DeliveryUncheckedUpdateInput): Promise<void> {
        await prisma.delivery.update({
           where: {
            orderId
           },
           data
        })
    }
    async chooseDeliveryMan({
        deliveryId,
        deliveryManId
    }: IChooseDeliveryMan): Promise<void> {
        await prisma.delivery.update({
            where: {
                id: deliveryId
            },
            data: {
                userId: deliveryManId
            }
        })
    }
    
    async findById(id: string){
        const delivery = await prisma.delivery.findUnique({
            where: {
                id
            }
        })

        return delivery
    }
    async confirmShipment({
        id,
        shipmentDate
    }: IConfirmShipment): Promise<void> {
        await prisma.delivery.update({
            where: {
                id
            },
            data: {
                shippingDate: shipmentDate
            }
        })
    }
    async confirmDelivery({
        id,
        deliveryDate,
        receiverName,
        receiverDocument,
        longitude,
        latitude
    }: IConfirmDelivery): Promise<void> {
        await prisma.delivery.update({
            where: {
                id
            },
            data: {
                deliveryDate,
                receiverName,
                receiverDocument,
                longitude,
                latitude
            }
        })
    }

}