import { eventBus } from "../event-bus";
import { IBierHeldProvider } from "@/providers/BierHeldProvider/bier-held-interface";
import { BierHeldProvider } from "@/providers/BierHeldProvider/implementations/bier-held-provider";
import { AppError } from "@/usecases/errors/app-error";
import { IUpdateUserNaturalErp } from "../interfaces/update-user-erp.interface";
import { IContactAttributes } from "@/providers/BierHeldProvider/interface/request/update-natural-client-request-interface";

export class UpdateUserNaturalErpListener {
    private bierHeldProvider: IBierHeldProvider

    constructor() {
        this.bierHeldProvider = new BierHeldProvider()

        eventBus.on('update.user.erp', this.execute.bind(this));
    }

    private async execute(user: IUpdateUserNaturalErp) {
        try{
            const getUserErp = await this.bierHeldProvider.getUser(user.erpId)

            if(!getUserErp){
                throw new AppError('Usuário nao encontrado no ERP', 404)
            }

            const destroyContactAttributes = getUserErp.contacts_attributes.map((contact) => {
                return{
                    id: contact.id,
                    contact_type: contact.contact_type,
                    value: contact.value,
                    _destroy: true
                }
            })

            const contactAttributes = [
                ...destroyContactAttributes,
                { 
                    contact_type: 'email',
                    value: user.email
                },
                {
                    contact_type: 'cellphone',
                    value: user.phone as string
                }
            ]

            await this.bierHeldProvider.updateNaturalPerson({
                id: user.erpId,
                fullName: user.name,
                birtDate: new Date(user.dateBirth!),
                active: true,
                cpf: user.cpf as string,
                contactAttributes: contactAttributes as IContactAttributes[],
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
        }catch(error){
            throw error
        }
    }
}
