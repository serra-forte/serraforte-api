import { Prisma, ShoppingCart } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { IShoppingCartRepository } from "../interfaces/interface-shopping-cart-repository";
import { prisma } from "@/lib/prisma";
import { IShoppingCartRelationsDTO } from "@/dtos/shopping-cart-relations.dto";

export class PrismaShoppingCartRepository implements IShoppingCartRepository{
    async updateTotal(id: string, total: number){
        const shoppingCart = await prisma.shoppingCart.update({
            where: {
                id
            },
            data: {
                total
            }
        })

        return shoppingCart
    }
    async create(data: Prisma.ShoppingCartUncheckedCreateInput){
        const shoppingCart = await prisma.shoppingCart.create({
            data, 
            select:{
                id:true,
                user: {
                    select:{
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                cartItem: {
                    select:{
                        product:{
                            select:{
                                id: true,
                                name: true,
                                price: true,
                                height: true,
                                width: true,
                                length: true,
                                weight: true,
                                quantity: true,
                                mainImage: true
                            }
                        }
                    }
                },
                total: true,
                expireDate: true
            }
        }) as unknown as ShoppingCart

        return shoppingCart
    }
    async list(){
       return prisma.shoppingCart.findMany()
       
    }
    async findByUserId(userId: string){
        const shoppingCart = await prisma.shoppingCart.findUnique({
            where: {userId},
            select:{
                id:true,
                user: {
                    select:{
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                cartItem: {
                    select:{
                        id: true,
                        product:{
                            select:{
                                id: true,
                                name: true,
                                price: true,
                                mainImage: true,
                                height: true,
                                width: true,
                                length: true,
                                weight: true,
                                quantity: true
                            }
                        },
                        userId: true,
                        quantity: true
                    }
                },
                total: true,
                expireDate: true
            }
        }) 

       if(!shoppingCart){
           return null
       }

        // Format the cart items
        const formattedCartItems = shoppingCart.cartItem.map(item => ({
            id: item.id,
            productId: item.product.id,
            userId: item.userId,
            name: item.product.name,
            price: Number(item.product.price),
            mainImage: item.product.mainImage,
            quantity: Number(item.quantity),
            height: Number(item.product.height),
            weight: Number(item.product.weight),
            width: Number(item.product.width),
            length: Number(item.product.length),
        }));

        return {
            ...shoppingCart,
            cartItem: formattedCartItems
        } as unknown as IShoppingCartRelationsDTO
    }
    async findById(id: string){
        const shoppingCart = await prisma.shoppingCart.findUnique({
            where: {id},
            select:{
                id:true,
                user: {
                    select:{
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                cartItem: {
                    select:{
                        id: true,
                        userId: true,
                        product:{
                            select:{
                                id: true,
                                name: true,
                                price: true,
                                mainImage: true,
                                height: true,
                                width: true,
                                length: true,
                                weight: true,
                                quantity: true,
                            }
                        },
                        quantity: true
                    }
                },
                total: true,
                expireDate: true
            }
        }) 

       if(!shoppingCart){
           return null
       }

        // Format the cart items
        const formattedCartItems = shoppingCart.cartItem.map(item => ({
            id: item.id,
            productId: item.product.id,
            userId: item.userId,
            name: item.product.name,
            mainImage: item.product.mainImage,
            price: item.product.price,
            quantity: item.quantity,
            weight: item.product.weight,
            height: item.product.height,
            width: item.product.width,
            length: item.product.length,
        }));


        return {
            ...shoppingCart,
            total: Number(shoppingCart.total),
            cartItem: formattedCartItems
        } as unknown as ShoppingCart
    }
    async deleteById(id: string){
        await prisma.shoppingCart.delete({
            where: {id}
        })
    }
}