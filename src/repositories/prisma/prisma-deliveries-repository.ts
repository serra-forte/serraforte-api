import { IChooseDeliveryMan, IConfirmDelivery, IConfirmShipment, IDeliveryRepository } from "@/repositories/interfaces/interface-deliveries-repository";
import { prisma } from '@/lib/prisma'

export class PrismaDeliveryRepository implements IDeliveryRepository{
    async addServiceIdToDelivery(serviceId: string, deliveryId: string): Promise<void> {
        await prisma.delivery.update({
            where: {
                id: deliveryId
            },
            data: {
                serviceId
            }
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