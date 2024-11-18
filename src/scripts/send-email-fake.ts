import { EtherealProvider } from "@/providers/MailProvider/implementations/provider-ethereal";

async function run() {
const ehtreal = await EtherealProvider.createTransporter();

    const pathTemplate = './views/emails/forgot-password.hbs'
    await ehtreal.sendEmail(
        'email@email.test', 
        'TuristaRV', 
        'Aprovação de Pagamento', 
        'https://notafiscal.com.br/1234', 
        pathTemplate,
        null
    );

}
run();