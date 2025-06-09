import { IMailProvider } from "@/providers/MailProvider/interface-mail-provider";
import { eventBus } from "../event-bus";
import { MailProvider } from "@/providers/MailProvider/implementations/provider-sendgrid";
import { IOrderRelationsDTO } from "@/dtos/order-relations.dto";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

export class SendOrderConfirmedEmailListener {
    private mailProvider: IMailProvider
    private usersRepository = new PrismaUsersRepository()

    constructor() {
        this.mailProvider = new MailProvider()
        this.usersRepository = new PrismaUsersRepository()

        eventBus.on('send.order.approved', this.execute.bind(this));
    }
    private async execute(order: IOrderRelationsDTO) {
        try{
        const listUsersAdmin = await this.usersRepository.listAdmins()
      
        const templatePathApproved = './views/emails/payment-approved.hbs'
        
        // [x] disparar envio de email de pagamento recebido do usuário com nota fiscal(invoice)
        await this.mailProvider.sendEmail(
          order.user.email,
          order.user.name,
          'Pagamento Aprovado',
          order.payment.invoiceUrl,
          templatePathApproved,
          {
            order: order,
          },
        )
        
        // [x] disparar envio de email de pagamento recebido para o admin com comprovante(payment - banco de dados API)
        const templatePathAdmin = './views/emails/admin-payment-approved.hbs'

        // [x] for para buscar users administradores e enviar email de pagamento aprovado
        for (const admin of listUsersAdmin) {
          await this.mailProvider.sendEmail(
            admin.email,
            admin.name,
            `Pagamento Aprovado`,
            order.payment.invoiceUrl,
            templatePathAdmin,
            {
              order: order,
            },
          )
        }
        }catch(error){
            throw error
        }
    }
}
