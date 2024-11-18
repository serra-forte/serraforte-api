import { Variables } from "./interface-mail-provider";


export interface IEthrealProvider {
    sendEmail(
        email: string, 
        name:string, 
        subject:string, 
        link:string,  
        pathTemplate:string,
        variables?:  Variables
    ): Promise<void>
}