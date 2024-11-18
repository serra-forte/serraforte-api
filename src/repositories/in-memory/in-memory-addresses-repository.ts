import { Address, Prisma } from "@prisma/client";
import { IAddressesRepository } from "../interface-addresses-repository";
import { randomUUID } from "crypto";

export class InMemoryAddressesRepository implements IAddressesRepository{
    private adresses: Address[] = [];

    async deleteById(id: string){
        const addressIndex = this.adresses.findIndex(address => address.id === id)

        this.adresses.splice(addressIndex, 1)
    }

    async create({
        id,
        street,
        num,
        district,
        city,
        state,
        country,
        zipCode,
        complement,
        reference,
        userId,
        idAnnouncement,
        idCamping,
    }: Prisma.AddressUncheckedCreateInput){
        const address = {
            id: id ? id : randomUUID(),
            userId: userId ? userId : null,
            idAnnouncement: idAnnouncement ? idAnnouncement : null,
            idCamping: idCamping ? idCamping : null,
            street,
            num: new Prisma.Decimal(num as number),
            district,
            city,
            state,
            country,
            zipCode: new Prisma.Decimal(zipCode as number),
            complement: complement ? complement : null,
            reference: reference ? reference : null,
        }

        this.adresses.push(address);

        return address;
    }

    async findById(id: string){
        const address = this.adresses.find((address) => address.id === id);
        
        if(!address){
            return null;
        }

        return address;
    }

    async updateById({
        id,
        num,
        city,
        complement,
        country,
        district,
        reference,
        state,
        street,
        zipCode,
    }: Prisma.AddressUncheckedUpdateInput){
        const addressIndex = this.adresses.findIndex((address) => address.id === id);

        this.adresses[addressIndex].num = num as Prisma.Decimal;
        this.adresses[addressIndex].city = city as string;
        this.adresses[addressIndex].complement = complement as string;
        this.adresses[addressIndex].country = country as string;
        this.adresses[addressIndex].district = district as string;
        this.adresses[addressIndex].reference = reference as string;
        this.adresses[addressIndex].state = state as string;
        this.adresses[addressIndex].street = street as string;
        this.adresses[addressIndex].zipCode = zipCode as Prisma.Decimal;

        return this.adresses[addressIndex];       
    }
}