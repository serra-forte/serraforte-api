import { env } from "@/env";
import { IAccessToken, IChargeOrderPaypalData, IChargePaypalData, ICustomerData, IPaypalProvider } from "../interface-paypal-payments";
import axios from 'axios'
import { randomUUID } from "node:crypto";

export class PaypalProvider implements IPaypalProvider{
    async authorizeOrderPayment(id:string, payment: IChargePaypalData, access_token: string): Promise<any> {
       try {
            const responseCreatePayment = await axios
                .post(`${env.PAYPAL_API_URL}/v2/checkout/orders/${id}/confirm-payment-source`, payment, {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                })
                .then((response) => {
                    return response.data
                })
            return responseCreatePayment
        } catch (error) {
            console.log(error)
        }
    }
    async captureOrdePayment(payment: IChargePaypalData, id:string, access_token: string): Promise<any> {
        try {
            const responseCreatePayment = await axios
                .post(`${env.PAYPAL_API_URL}/v2/checkout/orders/${id}/capture`, payment, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${access_token}`,
                        'PayPal-Request-Id': '556268e0-43df-424b-9bbe-ea9aa3cf2402'
                    },
                })
                .then((response) => {
                    return response.data
                })
            return responseCreatePayment
        } catch (error) {
            console.log(error)
        }
    }

    async createOrderPayment(payment:IChargeOrderPaypalData, access_token: string): Promise<any> {
        try {
            const responseCreatePayment = await axios
                .post(`${env.PAYPAL_API_URL}/v2/checkout/orders`,payment, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${access_token}`,
                        'PayPal-Request-Id': '556268e0-43df-424b-9bbe-ea9aa3cf2402'
                    },
                })
                .then((response) => {
                    return response.data
                })
            return responseCreatePayment
        } catch (error) {
            console.log(error)
        }
    }
   
    async generateAccessToken(): Promise<IAccessToken | undefined> {
        try {
            const responseGenerateAccessToken = await axios
                .post(`${env.PAYPAL_API_URL}/v1/oauth2/token`, 
                    'grant_type=client_credentials', // Dados devem ser enviados como uma string
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            // Authorization deve ser enviado no cabeçalho
                            Authorization: 'Basic ' + Buffer.from(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`).toString('base64'),
                        },
                    }
                )
                .then((response) => {
                    return response.data;
                });
            return responseGenerateAccessToken;
        } catch (error) {
            console.error(error);
        }
    }

}