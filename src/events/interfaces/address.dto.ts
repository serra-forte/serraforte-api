export interface IAddressDto {
    id: string
    street?: string | null,
    num?: number | null,
    neighborhood?: string | null,
    city?: string | null,
    state?: string | null,
    zipCode?: string | null,
    complement?: string | null,
    reference?: string | null,
}