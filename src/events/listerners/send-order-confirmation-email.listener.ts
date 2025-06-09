import { IMailProvider } from "@/providers/MailProvider/interface-mail-provider";
import { eventBus } from "../event-bus";
import { ISendOrderConfirmationEmail } from "../interfaces/send-order-confirmation.interface";
import { MailProvider } from "@/providers/MailProvider/implementations/provider-sendgrid";

export class SendOrderConfirmationEmailListener {
    mailProvider: IMailProvider
    constructor() {
        this.mailProvider = new MailProvider()
        eventBus.on('send.order.confirmation', this.execute.bind(this));
    }
    private async execute(data: ISendOrderConfirmationEmail) {
        try{
            await this.mailProvider.sendEmail(
                data.user.email,
                data.user.name,
                'Confirmação de Pagamento',
                data.invoiceUrl,
                './views/emails/confirmation-payment.hbs',
                {
                    order: data.order
                }
            );
        }catch(error){
            throw error
        }
    }
}
