import { IAddressesRepository } from "@/repositories/interfaces/interface-addresses-repository";
import { AppError } from "@/usecases/errors/app-error";
import { Address } from "@prisma/client";

interface IResquestFindAddress{
    id: string;
}

export class FindAddressByIdUseCase {
    constructor(
        private addressRepository: IAddressesRepository,
        ) {}

  async execute({id}:IResquestFindAddress): Promise<Address> {
    const checkAddressExists = await this.addressRepository.findById(id);

    if (!checkAddressExists) {
      throw new AppError("Endereço não encontrado", 404);
    }

    return checkAddressExists;
  }
}
