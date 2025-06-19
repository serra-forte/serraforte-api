import { IMailProvider } from "@/providers/MailProvider/interface-mail-provider";
import { eventBus } from "../event-bus";
import { MailProvider } from "@/providers/MailProvider/implementations/provider-sendgrid";
import { IOrderRelationsDTO } from "@/dtos/order-relations.dto";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

export class SendOrderReprovedEmailListener {
    private mailProvider: IMailProvider
    private usersRepository = new PrismaUsersRepository()

    constructor() {
        this.mailProvider = new MailProvider()
        this.usersRepository = new PrismaUsersRepository()

        eventBus.on('send.order.reproved', this.execute.bind(this));
    }
    private async execute(order: IOrderRelationsDTO) {
        try{
        const listUsersAdmin = await this.usersRepository.listAdmins()

        const templatePathUserReproved =
        './views/emails/payment-repproved.hbs'

          await this.mailProvider.sendEmail(
            order.user.email,
            order.user.name,
            'Pagamento Reprovado',
            order.payment.invoiceUrl,
            templatePathUserReproved,
            {
              order: order,
            },
          )
          const templatePathAdminPaymentReproved =
          './views/emails/admin-payment-reproved.hbs'

          for (const admin of listUsersAdmin) {
            await this.mailProvider.sendEmail(
              admin.email,
              admin.name,
              `Pagamento Reprovado`,
              order.payment.invoiceUrl,
              templatePathAdminPaymentReproved,
              {
                order: order,
              },
            )
          }
          console.log('[SendOrderReproved - API] Email enviado com sucesso')
        }catch(error){
            throw error
        }
    }
}
