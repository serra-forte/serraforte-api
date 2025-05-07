import { verify } from 'jsonwebtoken';
import { env } from "@/env";
import { IBierHeldProvider } from "../bier-held-interface";
import axios from 'axios'
import { ICreateNaturalClientRequest } from "../interface/request/create-natural-client-request-interface";
import { ICreateNaturalClientResponse } from "../interface/response/create-natural-client-response-interface";
import { IUpdateNaturalClientRequest } from "../interface/request/update-natural-client-request-interface ";

export class BierHeldProvider implements IBierHeldProvider{
    client!: string;
    accessToken!: string;

    constructor(){}
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
                        nfe_city_name: addressAttributes?.city,
                        nfe_city_state_acronym: addressAttributes?.state,
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

            if(errorHandler){
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

            if(errorHandler){
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
        switch(error.response.status){
            case 401:
                return await this.authentication()
            default:
                throw new Error('Internal Server Error')
        }
    }
}

