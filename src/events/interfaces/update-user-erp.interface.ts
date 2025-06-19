import { IAddressDto } from "./address.dto";

export interface IUpdateUserNaturalErp {
    id: string,
    erpId: number,
    name?: string | null,
    email?: string | null,
    phone?: string | null,
    dateBirth?: Date | null,
    cpf?: string | null,
    address?: IAddressDto | null,
}