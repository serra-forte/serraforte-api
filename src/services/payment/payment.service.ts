import { IAsaasPayment } from "@/dtos/asaas-payment.dto";
import { ICreatePaymentAsaas } from "../interfaces/request/create-payment-asaas.interface";
import { PaymentServiceBase } from "./payment.base";
import { ICustomerResponse, IAsaasProvider } from "@/providers/PaymentProvider/interface-asaas-payment";
import { PaymentMethod } from "@prisma/client";
import { ICreateCustomer } from "../interfaces/request/create-customer.interface";
import { AppError } from "@/usecases/errors/app-error";
import { IUserRelations } from "@/dtos/user-relations.dto";
import { ICardHolder } from "@/interfaces/credit-card.interface";
import { UserService } from "../user/user.service";

export class PaymentService implements PaymentServiceBase{
    constructor(
        private asaasProvider: IAsaasProvider,
        private userService: UserService
    ) {}
    
    async createCustomer(data: ICreateCustomer, userId: string): Promise<ICustomerResponse> {
        try{
            const result = await this.asaasProvider.createCustomer(data)

            if(!result){
                throw new AppError('Erro ao criar o cliente', 500)
            }

            const updateUser = await this.userService.updateAsaasCustomerId(userId, result.id)

            if(!updateUser){
                throw new AppError('Erro ao atualizar o usuário', 500)
            }

            return result
        } catch(error){
            throw error;
        }
    }

    async getCustomer(user: IUserRelations): Promise<ICustomerResponse> {
        try{
            const result = await this.asaasProvider.getCustomer(user.asaasCustomerId)

            if(!result){
                return await this.createCustomer({
                    name: user.name,
                    email: user.email,
                    cpfCnpj: user.cpf,
                    phone: user.phone?.replace('(+)', '').replace(' ', '') as string
                }, user.id)
            }

            return result
        }catch(error){
            throw error;
        }
    }

    async resolvePaymentMethod(data: ICreatePaymentAsaas): Promise<IAsaasPayment> {
        try{
            const customer = await this.getCustomer(data.user)

            switch(data.billingType){
                case PaymentMethod.PIX:{
                    const pix = await this.pix({
                        ...data,
                        customer: customer.id
                    })

                    if(!pix){
                        throw new AppError('Erro ao criar pagamento com pix', 500)
                    }

                    return pix
                }
                case PaymentMethod.BOLETO:{
                    const boleto = await this.boleto({
                        ...data,
                        customer: customer.id
                    })

                    if(!boleto){
                        throw new AppError('Erro ao criar pagamento com boleto', 500)
                    }

                    return boleto
                }
                case PaymentMethod.CREDIT_CARD:{
                    const creditCard = await this.creditCard({
                        ...data,
                        customer: customer.id
                    })

                    if(!creditCard){
                        throw new AppError('Erro ao criar pagamento com cartão de crédito', 500)
                    }

                    return creditCard
                }
            }
        }catch(error){
            throw error;
        }
    }

    private async pix(data: ICreatePaymentAsaas): Promise<IAsaasPayment> {
        try{
            const result = await this.asaasProvider.createPayment({
                billingType: PaymentMethod.PIX,
                dueDate: data.dueDate,
                value: data.value,
                remoteIp: data.remoteIp,
                customer: data.customer as string,
                description: data.description,
            })

            return result
        }catch(error){
            throw error;
        }
    }

    private async boleto(data: ICreatePaymentAsaas): Promise<IAsaasPayment> {
        try{
            const result = await this.asaasProvider.createPayment({
                billingType: PaymentMethod.PIX,
                dueDate: data.dueDate,
                value: data.value,
                remoteIp: data.remoteIp,
                customer: data.customer as string,
                description: data.description,
                installmentCount: 1,
                installmentValue: data.value
            })

            return result
        }catch(error){
            throw error;
        }
    }

    private async creditCard(data: ICreatePaymentAsaas): Promise<IAsaasPayment> {
        try{
            const result = await this.asaasProvider.createPayment({
                billingType: PaymentMethod.CREDIT_CARD,
                dueDate: data.dueDate,
                value: data.value,
                remoteIp: data.remoteIp,
                customer: data.customer as string,
                description: data.description,
                creditCard: data.creditCardData?.creditCard,
                creditCardHolderInfo: {
                    ...data.creditCardData?.creditCardHolderInfo as ICardHolder,
                    cpfCnpj: data.user.cpf,
                    name: data.user.name,
                    email: data.user.email
                },
                installmentCount: data.creditCardData?.installmentCount,
                installmentValue: data.value
            })

            return result
        }catch(error){
            console.log(error)
            throw error;
        }
    }
}