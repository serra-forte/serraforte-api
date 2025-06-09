import { CartItem, Prisma } from "@prisma/client";
import { ICartItemRepository } from "../interfaces/interface-cart-item-repository";
import { prisma } from "@/lib/prisma";
import { ICartItemRelationsDTO } from "@/dtos/cart-item-relations.dto";

export class PrismaCartItemRepository implements ICartItemRepository{
    async updatePrice(id: string, price: number): Promise<CartItem> {
        return prisma.cartItem.update({
            where: {
                id
            },
            data: {
                price
            }
        })
    }
    async create(data: Prisma.CartItemUncheckedCreateInput){
        const cartItem = await prisma.cartItem.create({
            data,
            select:{
                id: true,
                product: true,
                user: true,
                quantity: true,
                shopping: true
            }
        }) as unknown as ICartItemRelationsDTO

        
        return {
            id: cartItem.id,
            productId: cartItem.product.id,
            userId: cartItem.user.id,
            name: cartItem.product.name,
            price: cartItem.product.price,
            quantity: cartItem.quantity,
            mainImage: cartItem.product.mainImage
        } as unknown as CartItem
    }

    async list(){
        return prisma.cartItem.findMany()
    }
    
    async listByShoppingCartId(shoppingCartId: string){
        return prisma.cartItem.findMany({
            where: {
                shoppingCartId
            }
        })
    }
    
    async findById(id: string){
        const cartItem = await prisma.cartItem.findUnique({
            where: {
                id
            },
            select:{
                id: true,
                product: true,
                user: true,
                quantity: true,
                height: true,
                weight: true,
                width: true,
                length: true,
                shopping: true,
            }
        }) as unknown as ICartItemRelationsDTO

        if(!cartItem) return null

        
        return {
            id: cartItem.id,
            productId: cartItem.product.id,
            userId: cartItem.user.id,
            name: cartItem.product.name,
            price: cartItem.product.price,
            quantity: cartItem.quantity,
            height: cartItem.height,
            weight: cartItem.weight,
            width: cartItem.width,
            length: cartItem.length,
            mainImage: cartItem.product.mainImage
        } as unknown as CartItem
    }
    async incrementCartItemById(id: string, value:number){
        const cartItem = await prisma.cartItem.update({
            where: {
                id
            },
            data: {
                quantity: {
                    increment: 1
                },
                shopping:{
                    update:{
                        total: {
                            increment: value
                        }
                    }
                }
            },
            select:{
                id: true,
                product: true,
                user: true,
                shopping: true,
                quantity: true,
            }
        }) as unknown as ICartItemRelationsDTO

        
        return {
            id: cartItem.id,
            productId: cartItem.product.id,
            userId: cartItem.user.id,
            name: cartItem.product.name,
            price: cartItem.product.price,
            quantity: cartItem.quantity,
            mainImage: cartItem.product.mainImage
        } as unknown as CartItem
    }
    async decrementCartItemById(id: string, value: number){
        const cartItem = await prisma.cartItem.update({
            where: {
                id
            },
            data: {
                quantity: {
                    decrement: 1
                },
                shopping:{
                    update:{
                        total: {
                            decrement: value
                        }
                    }
                }
            },
            select:{
                id: true,
                product: true,
                user: true,
                shopping: true,
                quantity: true,
            }
        }) as unknown as ICartItemRelationsDTO

        
        return {
            id: cartItem.id,
            productId: cartItem.product.id,
            userId: cartItem.user.id,
            name: cartItem.product.name,
            price: cartItem.product.price,
            quantity: cartItem.quantity,
            mainImage: cartItem.product.mainImage
        } as unknown as CartItem
    }
    async deleteAllCartItemByShoppingCartId(shoppingCartId: string){
        await prisma.cartItem.deleteMany({
            where: {
                shoppingCartId
            }
        })

        return true
    }
    async deleteById(id: string){
        await prisma.cartItem.delete({
            where: {
                id
            }
        })
    }

    async deleteAllByShoppingCartId(shoppingCartId: string){
        await prisma.cartItem.deleteMany({
            where: {
                shoppingCartId
            },
        })
    }
}