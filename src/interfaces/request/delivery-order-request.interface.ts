import { PaymentMethod } from "@prisma/client"
import { IAddress } from "../address.interface"
import { ICoupom } from "../coupom.interface"
import { IFreight } from "../freight.interface"
import { ICreditCardPaymentData } from "../credit-card.interface"
import { IOrderUserInfo } from "../order-user-info"

export interface IDeliveryOrderRequest {
    userData: IOrderUserInfo
    remoteIp: string
    coupom?: ICoupom | null
    address: IAddress
    freight: IFreight
    paymentMethod: PaymentMethod
    creditCardData?: ICreditCardPaymentData | null
}