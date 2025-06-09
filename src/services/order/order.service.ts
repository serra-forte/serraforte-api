import { Status } from "@prisma/client";
import { ICreateDeliveryOrderRequest } from "../interfaces/request/create-delivery-order.interface";
import { ICreatePickUpOrderRequest } from "../interfaces/request/create-pick-up-order.interface";
import { OrderServiceBase } from "./order.base";
import { IOrderRepository } from "@/repositories/interfaces/interface-order-repository";
import { IOrderRelationsDTO } from "@/dtos/order-relations.dto";
import { IDateProvider } from "@/providers/DateProvider/interface-date-provider";

export class OrderService implements OrderServiceBase{
    constructor (
        private orderRepository: IOrderRepository,
        private dayjsProvider: IDateProvider,
    ) {}

    async deleteById(id: string): Promise<boolean> {
        try{
            const result = await this.orderRepository.deleteById(id)

            if(!result){
                throw new Error('Erro ao deletar o pedido')
            }

            return true
        } catch (error) {
            throw error
        }
    }
    async createDeliveryOrder(data: ICreateDeliveryOrderRequest): Promise<IOrderRelationsDTO> {
        try{
            const result = await this.orderRepository.create({
                shoppingCartId: data.shoppingCartId,
                userId: data.userId,
                total: data.total,
                withdrawStore: false,
                delivery:{
                    create:{
                        shippingDate: this.dayjsProvider.addDays(data.freight.delivery_time),
                        address: {
                            create: {
                                zipCode: data.address.zipCode,
                                city: data.address.city,
                                num: data.address.num,
                                state: data.address.state,
                                street: data.address.street,
                                neighborhood: data.address.neighborhood,
                                complement: data.address.complement,
                            }
                        },
                        serviceDelivery:{
                            create:{
                                companyName: data.freight.company.name,
                                serviceId: data.freight.id,
                                price: data.freight.price,
                                serviceName: data.freight.name
                            }
                        }
                    }
                },
                items: {
                    createMany: {
                        data: data.items.map(item => {
                            return {
                                productId: item.productId,
                                userId: item.userId as string,
                                quantity: item.quantity,
                                name: item.name,
                                price: Number(item.price),
                                mainImage: item.mainImage,
                                height: Number(item.height),
                                width: Number(item.width),
                                length: Number(item.length),
                                weight: Number(item.weight),
                            } 
                        })
                    }
                },
                payment:{
                    create:{
                        paymentStatus: Status.PENDING,
                        paymentMethod:  data.paymentMethod,
                        value: data.total,
                        discount: data.discount,
                        userId: data.userId
                    }
                }
            });

            if(!result){
                throw new Error('Erro ao criar o pedido de entrega')
            }

            return result
        }catch(error){
            throw error
        }
    }

    async createWithdrawOrder(data: ICreatePickUpOrderRequest): Promise<IOrderRelationsDTO> {
         try{
            const result = await this.orderRepository.create({
                shoppingCartId: data.shoppingCartId,
                userId: data.userId,
                total: data.total,
                withdrawStore: true,
                items: {
                    createMany: {
                        data: data.items.map(item => {
                            return {
                                productId: item.productId,
                                userId: item.userId as string,
                                quantity: item.quantity,
                                name: item.name,
                                price: Number(item.price),
                                mainImage: item.mainImage,
                                height: Number(item.height),
                                width: Number(item.width),
                                length: Number(item.length),
                                weight: Number(item.weight),
                            } 
                        })
                    }
                },
                payment:{
                    create:{
                        paymentStatus: Status.PENDING,
                        paymentMethod:  data.paymentMethod,
                        value: data.total,
                        discount: data.discount,
                        userId: data.userId
                    }
                }
            });

            if(!result){
                throw new Error('Erro ao criar o pedido de retirada')
            }

            return result
        }catch(error){
            throw error
        }
    }
}