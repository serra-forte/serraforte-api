import sgMail from '@sendgrid/mail';
import { env } from "@/env";
import 'dotenv/config'
import fs from 'node:fs'
import handlebars from "handlebars";
import { IMailProvider, Variables} from '../interface-mail-provider';
import { Message } from '../in-memory/in-memory-mail-provider';

export class MailProvider implements IMailProvider{
    constructor(){
        sgMail.setApiKey(env.SENDGRID_API_KEY)
    }
    findMessageSent(email: string): Promise<Message> {
        throw new Error('Method not implemented.');
    }

    async sendEmail(
        email: string, 
        name:string, 
        subject:string, 
        link:string, 
        pathTemplate:string,
        variables:  Variables | null
        ) {
        try {
            // ler arquivo handlebars
            const readTemplate = fs.readFileSync(pathTemplate).toString("utf-8");
            // compilar o arquivo handlebars
            const compileTemplate = handlebars.compile(readTemplate);
            // passar variables for template
            const htmlTemplate = compileTemplate({name, link, email, variables});

            const msg = {
                to: email, // Para 
                from: '4codesolutionss@gmail.com', // De 
                subject: subject, // Assunto
                html: htmlTemplate,
              };
            
           await sgMail.send(msg);
           console.log('Email enviado com sucesso')
        } catch (error) {
            console.log(error);
        }
    }
}