export interface IUpdateUserNaturalErp {
    erpId: number,
    name: string,
    email: string,
    phone?: string | null,
    dateBirth?: Date | null,
    cpf?: string | null,
    address?: {
        street?: string | null,
        num?: number | null,
        neighborhood?: string | null,
        city?: string | null,
        state?: string | null,
        zipCode?: string | null,
        complement?: string | null,
        reference?: string | null,
    } | null
}