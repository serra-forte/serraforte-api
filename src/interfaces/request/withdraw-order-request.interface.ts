import { PaymentMethod } from "@prisma/client"
import { ICoupom } from "../coupom.interface"
import { ICreditCardPaymentData } from "../credit-card.interface"

export interface IWithdrawOrderRequest {
    userId: string
    remoteIp: string
    coupom?: ICoupom | null
    paymentMethod: PaymentMethod
    creditCardData?: ICreditCardPaymentData | null
}