import { IMelhorEnvioProvider } from "@/providers/DeliveryProvider/interface-melhor-envio-provider";
import { IAddressesRepository } from "@/repositories/interfaces/interface-addresses-repository";
import { IStoreRepository } from "@/repositories/interfaces/interface-store-repository";
import { Address, Store } from "@prisma/client";

interface ICreateStoreRequest{
    userId: string
    name: string;             
    email: string;            
    description: string;      
    companyName: string;    
    document: string;        
    stateRegister: string;
    hasERPIntegration: boolean   
    address: {
        postalPode: string;   
        street: string;       
        number: string;        
        complement: string;    
        city: string;          
        state: string; 
    };
}

export class CreateStoreUseCase{
    constructor(
        private melhorEnvioProvider: IMelhorEnvioProvider,
        private storeRepository: IStoreRepository,
        private addressRepository: IAddressesRepository
    ){}
    async execute({
        userId,
        name,
        email,
        description,
        companyName,
        document,
        stateRegister,
        address,
        hasERPIntegration,
    }: ICreateStoreRequest){
        const store = await this.createStore({
            userId,
            name,
            email,
            description,
            companyName,
            document,
            stateRegister,
            address,
            hasERPIntegration,
        })

        if(!store){
            throw new Error('Store not created')
        }

        const addressCreated = await this.createAddress(address, store, userId)

        if(!addressCreated){
            throw new Error('Address not created')
        }

        return store
    }

    private async createStore({
        userId,
        name,
        email,
        description,
        companyName,
        document,
        stateRegister,
        hasERPIntegration
    }:ICreateStoreRequest): Promise<Store>{

         const storeCreated = await this.melhorEnvioProvider.createStore({
            name,
            email,
            description,
            company_name: companyName,
            document,
            state_register: stateRegister
        })

        if(!storeCreated){
            throw new Error('Store not created')
        }

        const store = await this.storeRepository.create({
            userId,
            melhorEnvioId: storeCreated.id,
            name,
            email,
            description,
            companyName,
            document,
            stateRegister,
            hasERPIntegration
        })

        return store
    }

    private async createAddress(address: ICreateStoreRequest['address'], store: Store, userId: string): Promise<Address>{
         const createAddressMelhorEnvio = await this.melhorEnvioProvider.createStoreAddress({
            store_id: store.id,
            address: address.street,
            number: address.number,
            city: address.city,
            state: address.state,
            postal_code: address.postalPode,
            complement: address.complement,
        })

        if(!createAddressMelhorEnvio){
            throw new Error('Address not created')
        } 

        const addressCreated = await this.addressRepository.create({
            street: address.street,
            num: address.number,
            city: address.city,
            state: address.state,
            zipCode: address.postalPode,
            complement: address.complement,
            country: 'Brasil',
            neighborhood: '',
            userId,
            storeId: store.id
        })

        if(!addressCreated){
            throw new Error('Address not created')
        }

        return addressCreated
    }
}