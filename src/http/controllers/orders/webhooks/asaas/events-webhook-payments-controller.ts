import { makePaymentWebHook } from '@/usecases/factories/orders/asaas/webhooks/make-payment-webhook-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function PaymentWebHook(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const eventPaymentSchema = z.object({
      event: z.enum(
        [
          'PAYMENT_REPROVED_BY_RISK_ANALYSIS',
          'PAYMENT_OVERDUE',
          'PAYMENT_CONFIRMED',
          'PAYMENT_RECEIVED',
        ],
        {
          invalid_type_error: 'Invalid event type',
        },
      ),
      payment: z.object({
        id: z.string(),
        customer: z.string(),
        installment: z.string().nullable().optional(),
        value: z.number().nonnegative(),
        netValue: z.number().nonnegative(),
        originalValue: z.number().nullable().optional(),
        description: z.string().nullable().optional(),
        billingType: z.string(),
        paymentDate: z.string().nullable().optional(),
        invoiceUrl: z.string().nullable().optional(),
        creditCard: z
          .object({
            creditCardToken: z.string(),
          })
          .nullable()
          .optional(),
      }),
    })
    const {
      event,
      payment: {
        id,
        installment,
        customer,
        value,
        netValue,
        originalValue,
        billingType,
        invoiceUrl,
        paymentDate,
        description,
        creditCard,
      },
    } = eventPaymentSchema.parse(request.body)

    const EventsWebHookPaymentsUseCase =
      await makePaymentWebHook()

    const payment = await EventsWebHookPaymentsUseCase.execute({
      event,
      payment: {
        id,
        installment: installment || null,
        customer,
        value,
        netValue,
        originalValue: originalValue || null,
        invoiceUrl: invoiceUrl || null,
        paymentDate: paymentDate || null,
        billingType,
        description: description || null,
        creditCard: creditCard || null,
      },
    })

    return reply.status(200).send(payment)
  } catch (error) {
    return reply.status(200).send({ message: error })
  }
}
