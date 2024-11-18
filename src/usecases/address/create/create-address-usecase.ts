import { IAddressesRepository } from "@/repositories/interface-addresses-repository";
import { IUsersRepository } from "@/repositories/interface-users-repository";
import { AppError } from "@/usecases/errors/app-error";
import { Address } from "@prisma/client";

interface IResquestCreateAddress{
    street: string;
    num: number;
    city: string;
    state: string;
    zipCode: number;
    complement?: string;
    reference?: string;
    country: string;
    neighborhood: string;
    idAnnouncement?: string;
    userId?: string;
}

export class CreateAddressUseCase {
  constructor(
    private addressRepository: IAddressesRepository,
    private usersRepository: IUsersRepository,
    ) {}

  async execute({
    street,
    num,
    city,
    state,
    zipCode,
    complement,
    reference,
    country,
    neighborhood,
    idAnnouncement,
    userId,
  }: IResquestCreateAddress): Promise<Address> {

    if(userId){
        // encontrar usuario pelo id
        const findUserExist = await this.usersRepository.findById(userId)

        // validar se usuario existe
        if(!findUserExist){
            throw new AppError('Usuário não encontrado', 404)
        }
    }
    
    const address = await this.addressRepository.create({
        street,
        num,
        city,
        state,
        zipCode,
        complement,
        reference,
        country,
        neighborhood,
        idAnnouncement,
        userId,
    });

    return address;
  }
}
