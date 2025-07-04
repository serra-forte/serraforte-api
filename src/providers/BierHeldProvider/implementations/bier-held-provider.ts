import { env } from "@/env";
import { IBierHeldProvider } from "../bier-held-interface";
import axios from 'axios'
import { ICreateNaturalClientRequest } from "../interface/request/create-natural-client-request-interface";
import { ICreateNaturalClientResponse } from "../interface/response/create-natural-client-response-interface";
import { IUpdateNaturalClientRequest } from "../interface/request/update-natural-client-request-interface";
import { ICreateOrderRequest } from '../interface/request/create-order-request-interface';
import { IGetItemResponse } from "../interface/response/get-item-response-interface";
import { IListItemsRequest } from "../interface/request/list-items-request-interface";
import { IListItemsResponse } from "../interface/response/list-items-response-interface";

export class BierHeldProvider implements IBierHeldProvider{
    client!: string;
    accessToken!: string;

    constructor(){}
    
    async getItem(id: number): Promise<IGetItemResponse | null> {
        try{
            const path = `${env.BIER_HELD_API_URL}/v2/items/find_by_code/${id}`

            await this.verifyToken()

            const response = await axios.get<IGetItemResponse>(path, {
                headers: {
                    'Content-Type': 'application/json',
                    'access-token': this.accessToken,
                    'client': this.client,
                    'uid': env.BIER_HELD_CLIENT_ID
                },
            })
            return response.data
        }catch(error){
            const errorHandler = await this.errorHandler(error)
            if(errorHandler === true){
                return await this.getItem(id)
            }

            throw errorHandler
        }
    }
    async createOrder(data: ICreateOrderRequest): Promise<Error | ICreateOrderResponse> {
        try{
            const path = `${env.BIER_HELD_API_URL}/v2/orders`

            await this.verifyToken()

            const response = await axios.post<ICreateOrderResponse>(path, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'access-token': this.accessToken,
                    'client': this.client,
                    'uid': env.BIER_HELD_CLIENT_ID
                },
            })
            return response.data
        }catch(error){
            const errorHandler = await this.errorHandler(error)
            if(errorHandler === true){
                return await this.createOrder(data)
            }

            throw errorHandler
        }
    }
    private async verifyToken(): Promise<void> {
        if(!this.accessToken || !this.client){
           await this.authentication()
        }

    }
    async updateNaturalPerson({
        id,
        fullName,
        cpf,
        active,
        contactAttributes,
        addressAttributes,
        birtDate
    }: IUpdateNaturalClientRequest): Promise<Error | void> {
        try{
            const path = `${env.BIER_HELD_API_URL}/v2/person_clients/${id}`

            const body = {
                person_client: {
                    full_name: fullName,
                    cpf,
                    contacts_attributes: contactAttributes,
                    address_attributes: {
                        street: addressAttributes?.street,
                        number: addressAttributes?.number,
                        complement: addressAttributes?.complement,
                        district: addressAttributes?.neighborhood,
                        zip: addressAttributes?.zipCode
                    },
                    birth_date: birtDate,
                    active
                }
            }

            await this.verifyToken()

            await axios.put<ICreateNaturalClientResponse>(path, body, {
                headers: {
                    'Content-Type': 'application/json',
                    'access-token': this.accessToken,
                    'client': this.client,
                    'uid': env.BIER_HELD_CLIENT_ID
                },
            })
        }catch(error){
            console.log(error);
            
            const errorHandler = await this.errorHandler(error)

            if(errorHandler === true){
                return await this.updateNaturalPerson({
                    id,
                    fullName,
                    cpf,
                    active,
                    contactAttributes,
                    addressAttributes,
                    birtDate
                })
            }

            throw errorHandler
        }
    }
    async createNaturalPerson({
        fullName,
        cpf,
        contactAttributes,
        addressAttributes,
        birtDate
    }: ICreateNaturalClientRequest): Promise<Error | ICreateNaturalClientResponse> {
        try{
            const path = `${env.BIER_HELD_API_URL}/v2/person_clients`

            const body = {
                person_client: {
                    full_name: fullName,
                    cpf,
                    contacts_attributes: contactAttributes,
                    address_attributes: addressAttributes,
                    birth_date: birtDate,
                    active: true
                }
            }

            await this.verifyToken()

            const { data } = await axios.post<ICreateNaturalClientResponse>(path, body, {
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

            if(errorHandler === true){
                return await this.createNaturalPerson({
                    fullName,
                    cpf,
                    contactAttributes,
                })
            }

            throw errorHandler
        }
    }
    async authentication(): Promise<boolean> {
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
        const message = error.response.data[0]
        switch(error.response.status){
            case 401:
                return await this.authentication()
            default:
                throw new Error(message)
        }
    }
}

