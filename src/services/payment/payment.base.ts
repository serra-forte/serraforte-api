import { IAsaasPayment } from "@/dtos/asaas-payment.dto";
import { ICreatePaymentAsaas } from "../interfaces/request/create-payment-asaas.interface";

export abstract class PaymentServiceBase {
    abstract resolvePaymentMethod(data: ICreatePaymentAsaas): Promise<IAsaasPayment>
}