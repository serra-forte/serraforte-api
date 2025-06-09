import { IAsaasPayment } from "@/dtos/asaas-payment.dto";
import { ICreatePaymentAsaas } from "../interfaces/request/create-payment-asaas.interface";
import { ICustomerResponse } from "@/providers/PaymentProvider/interface-asaas-payment";
import { ICreateCustomer } from "../interfaces/request/create-customer.interface";
import { IUserRelations } from "@/dtos/user-relations.dto";

export abstract class PaymentServiceBase {
    abstract resolvePaymentMethod(data: ICreatePaymentAsaas): Promise<IAsaasPayment>
    abstract getCustomer(user: IUserRelations): Promise<ICustomerResponse> 
    abstract createCustomer(data: ICreateCustomer, userId: string): Promise<ICustomerResponse>
}