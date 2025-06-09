import { Payment, Prisma, Status } from '@prisma/client'

export interface IPaymentsRepository {
  create(data: Prisma.PaymentUncheckedCreateInput): Promise<Payment>
  list(page: number): Promise<Payment[]>
  listByPaymentStatus(status: string, page?: number): Promise<Payment[]>
  findById(id: string): Promise<Payment | null>
  findByOrderId(id: string): Promise<Payment | null>
  listByAsaasPaymentId(id: string): Promise<Payment[]>
  updateById(
    id: string,
    paymentStatus: Status,
    datePayment: Date,
  ): Promise<Payment>
  updateStatus(paymentId: string, status: Status): Promise<void>

  deleteById(id: string): Promise<void>
    updateInvoiceUrl(id: string, invoiceUrl: string): Promise<boolean>

}
