import { eventBus } from "../event-bus";
import { IBierHeldProvider } from "@/providers/BierHeldProvider/bier-held-interface";
import { BierHeldProvider } from "@/providers/BierHeldProvider/implementations/bier-held-provider";
import { AppError } from "@/usecases/errors/app-error";
import { IUpdateUserNaturalErp } from "../interfaces/update-user-erp.interface";
import { IAddressesRepository } from "@/repositories/interfaces/interface-addresses-repository";
import { PrismaAddressesRepository } from "@/repositories/prisma/prisma-addresses-repository";

export class UpdateUserAddressErpListener {
    private bierHeldProvider: IBierHeldProvider
    private addressRepository: IAddressesRepository

    constructor() {
        this.bierHeldProvider = new BierHeldProvider()
        this.addressRepository = new PrismaAddressesRepository()

        eventBus.on('update.user.address.erp', this.execute.bind(this));
    }

    private async execute(user: IUpdateUserNaturalErp) {
        try{
            const getUserErp = await this.bierHeldProvider.getUser(user.erpId)

            if(!getUserErp){
                throw new AppError('Usuário nao encontrado no ERP', 404)
            }

            if(user.address){
            // Setar ultimo endereço usado no pedido do usuário
            await this.addressRepository.setLastUsedAddress(user.address.id, user.id)
            }

            await this.bierHeldProvider.updateNaturalPerson({
                id: user.erpId,
                active: true,
                addressAttributes:{
                    street: user.address?.street as string,
                    number: String(user.address?.num),
                    district: user.address?.neighborhood as string,
                    city: user.address?.city as string,
                    state: user.address?.state as string,
                    zip: user.address?.zipCode as string,
                    complement: user.address?.complement,
                }
            })

            console.log('[UpdateUserAddress - ERP] Usuário atualizado com sucesso')
        }catch(error){
            throw error
        }
    }
}
