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
import { IPaymentsRepository } from "@/repositories/interfaces/interface-payments-repository";
import { CustomerSchema } from "./dto/response/customer.dto";

export class PaymentService implements PaymentServiceBase{
    constructor(
        private asaasProvider: IAsaasProvider,
        private userService: UserService,
        private paymentRepository: IPaymentsRepository
    ) {}

    private async createCustomer(data: ICreateCustomer, userId: string): Promise<ICustomerResponse> {
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

    private async getCustomer(user: IUserRelations): Promise<ICustomerResponse> {
        try{
            if(user.asaasCustomerId){
                const result = await this.asaasProvider.getCustomer(user.asaasCustomerId)

                if(!result){
                    throw new AppError('Erro ao buscar o cliente', 500)
                }

                return result
            }

            const result = await this.createCustomer({
                    name: user.name,
                    email: user.email,
                    cpfCnpj: user.cpf,
                    phone: user.phone?.replace('(+)', '').replace(' ', '') as string
                }, user.id)
           

            return result
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

            if(!result){
                throw new AppError('Erro ao criar pagamento com pix', 500)
            }

            await this.updatePaymentOrderId(result, data.orderId)

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

            if(!result){
                throw new AppError('Erro ao criar pagamento com boleto', 500)
            }

            await this.updatePaymentOrderId(result, data.orderId)

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

            if(!result){
                throw new AppError('Erro ao criar pagamento com cartão de crédito', 500)
            }

            await this.updatePaymentOrderId(result, data.orderId)

            return result
        }catch(error){
            throw error;
        }
    }

    private async updatePaymentOrderId(asaasPayment: IAsaasPayment, orderId: string): Promise<void> {
        try{
            const result = await this.paymentRepository.updateByOrderId({
                orderId,
                asaasPaymentId: asaasPayment.id,
                invoiceUrl: asaasPayment.invoiceUrl,
                installmentCount: asaasPayment.installment,
                installmentValue: asaasPayment.value,
            })

            if(!result){
                throw new AppError('Erro ao atualizar o pagamento do pedido', 500)
            }
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

                    return pix
                }
                case PaymentMethod.BOLETO:{
                    const boleto = await this.boleto({
                        ...data,
                        customer: customer.id
                    })

                    return boleto
                }
                case PaymentMethod.CREDIT_CARD:{
                    const creditCard = await this.creditCard({
                        ...data,
                        customer: customer.id
                    })

                    return creditCard
                }
            }
        }catch(error){
            throw error;
        }
    }
}