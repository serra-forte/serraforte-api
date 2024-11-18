import { Item } from "@prisma/client";
import { IItemsRepository } from "../interfaces/interface-items-repository";
import { prisma } from "@/lib/prisma";

export class PrismaItemsRepository implements IItemsRepository{
    async findById(id: string){
        const item = await prisma.item.findUnique({
            where: {
                id
            },
            select:{
                id: true,
                orderId: true,
                userId: true,
                name: true,
                price: true,
                mainImage: true,
                quantity: true,
                order:{
                    select:{
                        id: true,
                        status: true,
                        delivery:{
                            select:{
                                shippingDate: true,
                                deliveryDate: true
                            }
                        }
                    }
                },
                product:{
                    select:{
                        id: true,
                        category: true
                    }
                }
            }
        }) as unknown as Item

        return item
    }
}