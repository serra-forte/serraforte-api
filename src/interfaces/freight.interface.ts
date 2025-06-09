export interface ICompanyFreight {
    id: number
    name: string
}

export interface IFreight {
    id: number
    name: string
    price: number
    delivery_time: number
    company: ICompanyFreight
}