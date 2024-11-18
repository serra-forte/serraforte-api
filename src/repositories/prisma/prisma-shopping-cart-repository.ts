import { Prisma, ShoppingCart } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { IShoppingCartRepository } from "../interfaces/interface-shopping-cart-repository";
import { prisma } from "@/lib/prisma";

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
                                mainImage: true
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
            price: item.product.price,
            mainImage: item.product.mainImage,
            quantity: item.quantity,
        }));

        return {
            ...shoppingCart,
            cartItem: formattedCartItems
        } as unknown as ShoppingCart
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
                                mainImage: true
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
            price: item.product.price,
            mainImage: item.product.mainImage,
            quantity: item.quantity,
        }));

        return {
            ...shoppingCart,
            cartItem: formattedCartItems
        } as unknown as ShoppingCart
    }
    async deleteById(id: string){
        await prisma.shoppingCart.delete({
            where: {id}
        })
    }
}