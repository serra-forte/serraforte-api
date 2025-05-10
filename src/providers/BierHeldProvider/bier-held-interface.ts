import { ICreateNaturalClientRequest } from "./interface/request/create-natural-client-request-interface"
import { ICreateOrderRequest } from "./interface/request/create-order-request-interface"
import { IUpdateNaturalClientRequest } from "./interface/request/update-natural-client-request-interface"
import { ICreateNaturalClientResponse } from "./interface/response/create-natural-client-response-interface"

export interface IBierHeldProvider {
    authentication(): Promise<boolean>
    createNaturalPerson(data: ICreateNaturalClientRequest): Promise<Error | ICreateNaturalClientResponse>
    updateNaturalPerson(data: IUpdateNaturalClientRequest): Promise<Error | void>
    errorHandler(error: any): Promise<Error | boolean> 
    createOrder(data: ICreateOrderRequest): Promise<Error | ICreateOrderResponse>
}
    