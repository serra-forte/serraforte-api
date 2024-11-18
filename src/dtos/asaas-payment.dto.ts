export interface IAsaasPayment {
    id: string
    customer: string
    billingType: string
    value: number
    description: string
    invoiceUrl: string
    installment?: string
    externalReference: string
    paymentDate: string
    dueDate: string
    status: string
}

