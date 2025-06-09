import { PrismaOrderRepository } from '../../../../../repositories/prisma/prisma-orders-repository';
import { PrismaPaymentRepository } from '../../../../../repositories/prisma/prisma-payments-repository';
import { KafkaProducer } from '@/providers/QueueProvider/kafka/kafka-producer';
import { RemoteConfigProviderFirebase } from '@/providers/RemoteConfigProvider/implementations/provider-remote-config';
import { EventBus } from '@/events/event-bus.provider';
import { PaymentWebHookUseCases } from '@/usecases/orders/create/Asaas/Webhooks/payments-webhook-usecases';

export async function makePaymentWebHook(): Promise<PaymentWebHookUseCases> {
  const remoteConfigProvider = new RemoteConfigProviderFirebase()
  const paymentsRepository = new PrismaPaymentRepository
  const orderRepository = new PrismaOrderRepository()
  const kafkaProvider = new KafkaProducer();
  const eventBus = new EventBus()

  const paymentWebHookUseCases = new PaymentWebHookUseCases(
    paymentsRepository,
    orderRepository,
    kafkaProvider,
    remoteConfigProvider,
    eventBus
  )

  return paymentWebHookUseCases
}
