export interface ICustomerData{
    id: string
    merchant_customer_id: string
}

export interface IAccessToken{
    scope: string
    access_token: string
    token_type: string,
    app_id: string,
    expires_in: number,
    nonce: string
}

export interface ITokenDate{
    id: string
    type: string
}

export interface IPurchaseUnit{
    reference_id: string
    amount: {
        currency_code: string
        value: string
    }
}

export interface IChargePaypalData{
    payment_source?: {
        card: {
            name: string,
            number: string,
            security_code: string,
            expiry: string,
            type: 'CREDIT' | 'DEBIT',
            brand: string,
            billing_address: {
                address_line_1: string,
                address_line_2: string,
                admin_area_2: string,
                admin_area_1: string,
                postal_code: string,
                country_code: string
            }
        }
    },
    token: ITokenDate
}

export interface IChargeOrderPaypalData{
    intent: 'CAPTURE',
    purchase_units: IPurchaseUnit[],
}

export interface IPaypalProvider{
    generateAccessToken(): Promise<IAccessToken | undefined>
    createOrderPayment(payment: IChargeOrderPaypalData, access_token: string): Promise<any | undefined>
    authorizeOrderPayment(id:string, payment: IChargePaypalData, access_token: string): Promise<any | undefined>
    captureOrdePayment(payment: IChargePaypalData, id:string, access_token: string): Promise<any | undefined>
}