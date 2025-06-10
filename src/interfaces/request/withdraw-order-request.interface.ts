import { PaymentMethod } from "@prisma/client"
import { ICoupom } from "../coupom.interface"
import { ICreditCardPaymentData } from "../credit-card.interface"
import { IOrderUserInfo } from "../order-user-info"

export interface IWithdrawOrderRequest {
    userData: IOrderUserInfo
    remoteIp: string
    coupom?: ICoupom | null
    paymentMethod: PaymentMethod
    creditCardData?: ICreditCardPaymentData | null
}