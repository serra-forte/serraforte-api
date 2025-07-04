import { IMelhorEnvioProvider } from "@/providers/DeliveryProvider/interface-melhor-envio-provider";
import { IAddressesRepository } from "@/repositories/interfaces/interface-addresses-repository";
import { IStoreRepository } from "@/repositories/interfaces/interface-store-repository";
import { AppError } from "@/usecases/errors/app-error";
import { Address, Store } from "@prisma/client";

interface ICreateStoreRequest{
    userId: string
    name: string;             
    email: string;            
    description: string;      
    companyName: string;    
    document: string;        
    stateRegister: string;
    address: {
        postalCode: string;   
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
        })

        if(!store){
            throw new Error('Store not created')
        }

        const addressCreated = await this.createAddress(address, store, userId)

        if(!addressCreated){
            throw new Error('Address not created')
        }

    }

    private async createStore({
        userId,
        name,
        email,
        description,
        companyName,
        document,
        stateRegister,
    }:ICreateStoreRequest): Promise<Store>{
         const storeCreated = await this.melhorEnvioProvider.createStore({
            name,
            email,
            description,
            company_name: companyName,
            document,
            state_register: stateRegister
        })

        if(storeCreated instanceof AppError){
            throw new AppError(storeCreated.message)
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
        })

        return store
    }

    private async createAddress(address: ICreateStoreRequest['address'], store: Store, userId: string): Promise<Address>{
         const createAddressMelhorEnvio = await this.melhorEnvioProvider.createStoreAddress({
            store_id: store.melhorEnvioId as string,
            address: address.street,
            number: address.number,
            city: address.city,
            state: address.state,
            postal_code: address.postalCode,
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
            zipCode: address.postalCode,
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