import { INaturalClientRequest } from "./interface/request/natural-client-request-interface"
import { INaturalClientResponse } from "./interface/response/natural-client-response-interface"

export interface IBierHeldProvider {
    authentication(): Promise<true>
    createNaturalPerson(data: INaturalClientRequest): Promise<Error | INaturalClientResponse>
    errorHandler(error: any): Promise<Error | boolean> 
}
    