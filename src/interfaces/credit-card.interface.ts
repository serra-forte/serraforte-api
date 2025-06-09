export interface ICreditCard{
    holderName: string
    number: string
    expiryMonth: string
    expiryYear: string
    ccv: string
}

export interface ICardHolder{
    name?: string | null
    email?: string | null
    cpfCnpj?: string | null
    postalCode: string
    addressNumber: string
    addressComplement?: string | null
    phone?: string | null
}

export interface ICreditCardPaymentData {
    creditCard?: ICreditCard
    creditCardHolderInfo?: ICardHolder
    installmentCount?: number
    installmentValue?: number
}