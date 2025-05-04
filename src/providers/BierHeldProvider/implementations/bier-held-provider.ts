import { env } from "@/env";
import { IBierHeldProvider } from "../bier-held-interface";
import axios from 'axios'
import { INaturalClientRequest } from "../interface/request/natural-client-request-interface";
import { AppError } from "@/usecases/errors/app-error";
import { INaturalClientResponse } from "../interface/response/natural-client-response-interface";

export class BierHeldProvider implements IBierHeldProvider{
    client!: string;
    accessToken!: string;

    constructor(){}
    
    async createNaturalPerson({
        fullName,
        cpf,
        contactAttributes,
        addressAttributes,
        birtDate
    }: INaturalClientRequest): Promise<Error | INaturalClientResponse> {
        try{
            const path = `${env.BIER_HELD_API_URL}/v2/person_clients`

            const body = {
                person_client: {
                    full_name: fullName,
                    cpf,
                    contacts_attributes: contactAttributes,
                    address_attributes: addressAttributes,
                    birth_date: birtDate
                }
            }

            const { data } = await axios.post<INaturalClientResponse>(path, body, {
                headers: {
                    'Content-Type': 'application/json',
                    'access-token': this.accessToken,
                    'client': this.client,
                    'uid': env.BIER_HELD_CLIENT_ID
                },
            })

            return data
        }catch(error){
            console.log(error);
            
            const errorHandler = await this.errorHandler(error)

            if(errorHandler){
                await this.createNaturalPerson({
                    fullName,
                    cpf,
                    contactAttributes,
                })
            }

            throw errorHandler
        }
    }

    async authentication(): Promise<true> {
        try{
            const path = `${env.BIER_HELD_API_URL}/auth/sign_in`
            
            const body ={
                email: env.BIER_HELD_CLIENT_ID,
                password: env.BIER_HELD_PASSWORD
            }

            const response = await axios.post(path, body,{
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            this.accessToken = response.headers['access-token'];
            this.client = response.headers['client'];

            return true
        }catch(error){
            console.log(error);

            throw this.errorHandler(error)
        }
    }

    async errorHandler(error: any): Promise<Error | boolean> {
        switch(error.response.status){
            case 401:
                return await this.authentication()
            default:
                throw new Error('Internal Server Error')
        }
    }
}

