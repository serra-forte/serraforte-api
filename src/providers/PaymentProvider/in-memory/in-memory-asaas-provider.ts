import { randomUUID } from 'crypto'
import {
  IAsaasProvider,
  IChargeData,
  ICustomerData,
} from '../interface-asaas-payment'
import { IDateProvider } from '@/providers/DateProvider/interface-date-provider'
interface IInstallmentsInfo {
  id: string
  installments?: string
  installmentCount?: number
  paymentValue?: number
}
interface IPayment {
  id: string
  customer: string
  value: number
  netValue: number
  billingType: string
  installment: string
  creditCard: any
  status: string
  dueDate: string
  invoiceUrl: string
  externalReference: string
  description: string
  creditCardToken: string
}
export class InMemoryAsaasProvider implements IAsaasProvider {
  private payments: IChargeData[] = []
  private customers: ICustomerData[] = []
  private installments: IInstallmentsInfo[] = []

  constructor(private dayjsDateProvider: IDateProvider) {}

  async createPayment({
    customer,
    billingType,
    value,
    dueDate,
    installmentCount,
    installmentValue,
    installment,
    description,
    externalReference,
    creditCard,
    creditCardHolderInfo,
    discount,
    fine,
    interest,
    remoteIp,
  }: IChargeData) {
    const payment = {
      id: randomUUID(),
      customer,
      billingType,
      value,
      dueDate,
      installmentCount,
      installmentValue,
      installment,
      description,
      externalReference,
      creditCard,
      creditCardHolderInfo,
      discount,
      fine,
      interest,
      remoteIp,
    }
    const instalmentsInfo = {
      id: payment.id,
      installments: randomUUID(),
      installmentCount: installmentCount as number,
      paymentValue: installmentValue as number,
    }

    this.payments.push(payment)
    this.installments.push(instalmentsInfo)

    let netValue = 0
    const dateExpireDiscount = new Date('2023-12-19')
    const dateNow = this.dayjsDateProvider.dateNow()
    const verifyDiscountActive = this.dayjsDateProvider.compareIfBefore(
      dateNow,
      dateExpireDiscount,
    )

    if (billingType === 'BOLETO' || billingType === 'PIX') {
      if (verifyDiscountActive) {
        netValue = Number(Math.abs(value - 0.99).toFixed(2))
      } else {
        netValue = Number(Math.abs(value - 1.99).toFixed(2))
      }
    }

    if (billingType === 'CREDIT_CARD') {
      if (verifyDiscountActive) {
        netValue = Math.abs(Number((value * 0.0199 + 0.49).toFixed(2)) - value)
      } else {
        netValue = Math.abs(Number((value * 0.0299 + 0.49).toFixed(2)) - value)
      }
    }

    if (billingType === 'CREDIT_CARD' && Number(installmentCount) <= 6) {
      if (verifyDiscountActive) {
        netValue = Math.abs(Number((value * 0.0249 + 0.49).toFixed(2)) - value)
      } else {
        netValue = Math.abs(Number((value * 0.0349 + 0.49).toFixed(2)) - value)
      }
    }

    if (billingType === 'CREDIT_CARD' && Number(installmentCount) > 6) {
      if (verifyDiscountActive) {
        netValue = Math.abs(Number((value * 0.0299 + 0.49).toFixed(2)) - value)
      } else {
        netValue = Math.abs(Number((value * 0.0399 + 0.49).toFixed(2)) - value)
      }
    }

    return {
      id: payment.id,
      customer: payment.customer,
      value: payment.value,
      netValue,
      billingType: payment.billingType,
      installment: instalmentsInfo.id,
      status: 'PAYMENT_RECEIVED',
      creditCard: payment.creditCard,
      dueDate: payment.dueDate,
      invoiceUrl: 'https://invoice.com',
      description: payment.description,
      externalReference,
      creditCardToken: randomUUID(),
    } as IPayment
  }

  async createCustomer({ cpfCnpj, email, name, phone }: ICustomerData) {
    const customer = {
      id: randomUUID(),
      cpfCnpj,
      email,
      name,
      phone,
    }

    this.customers.push(customer)

    return customer
  }

  async findUniqueInstallments(idInstallment: string) {
    const findInstallments = this.installments.find(
      (installment) => installment.id === idInstallment,
    )

    if (!findInstallments) {
      return null
    }

    return findInstallments
  }
}
