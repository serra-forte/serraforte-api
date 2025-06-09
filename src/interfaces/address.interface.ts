export interface IAddress{
    street: string
    neighborhood: string
    city: string
    state: string
    country: string
    zipCode: string
    num?: number | null
    complement?: string | null
    reference?: string | null
}